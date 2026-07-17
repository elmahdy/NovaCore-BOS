#!/usr/bin/env bash
# =====================================================================
# NovaCore BOS - Déploiement automatique (cohabitation Plesk)
# Cible : Debian 12 + Plesk (VPS OVH)
#
# Améliorations :
#   - Détection AUTOMATIQUE du domaine via Plesk (pas de valeur en dur)
#   - Copie de l'installateur graphique dans <domaine>/httpdocs/install/
#   - Récapitulatif final enrichi
#   - Auto-suppression du script après succès
# =====================================================================

set -euo pipefail

APP_DIR="/opt/novacore"
LOG=/var/log/novacore-setup.log
exec > >(tee -a "$LOG") 2>&1

echo ""
echo "==================================================="
echo "  NovaCore BOS - Déploiement  $(date)"
echo "==================================================="

# --- Vérif root ---
if [ "$(id -u)" -ne 0 ]; then
  echo "ERREUR : lance ce script en root"; exit 1
fi

# --- Vérif code présent ---
if [ ! -f "$APP_DIR/kernel/package.json" ]; then
  echo "ERREUR : $APP_DIR/kernel/package.json introuvable."; exit 1
fi

# =====================================================================
# 0. Détection AUTOMATIQUE du domaine via Plesk
# =====================================================================
echo "--> [0/9] Détection du domaine (Plesk)"
DOMAIN=""
if command -v plesk &>/dev/null; then
  DOMAIN=$(plesk bin domain --list 2>/dev/null | head -1 || true)
fi
if [ -z "$DOMAIN" ]; then
  DOMAIN=$(hostname -f)
  echo "    Plesk non détecté, fallback hostname : $DOMAIN"
else
  echo "    Domaine détecté : $DOMAIN"
fi
WEBROOT="/var/www/vhosts/$DOMAIN/httpdocs"

# =====================================================================
# 1. Utilisateur applicatif
# =====================================================================
echo "--> [1/9] Utilisateur applicatif 'novacore'"
id novacore &>/dev/null || useradd -r -m -s /usr/sbin/nologin novacore

# =====================================================================
# 2. Docker (dépôt Debian)
# =====================================================================
echo "--> [2/9] Docker"
if ! command -v docker &>/dev/null; then
  apt-get update
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/debian $(. /etc/os-release; echo $VERSION_CODENAME) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi
systemctl enable --now docker

# =====================================================================
# 3. Node.js 20
# =====================================================================
echo "--> [3/9] Node.js 20"
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v

# =====================================================================
# 4. (Caddy ignoré - Plesk gère le web)
# =====================================================================
echo "--> [4/9] Caddy ignoré (Plesk gère le reverse-proxy/SSL)"

# =====================================================================
# 5. Secrets (générés une seule fois)
# =====================================================================
echo "--> [5/9] Secrets"
SECRETS_FILE="$APP_DIR/.novacore-secrets"
if [ -f "$SECRETS_FILE" ]; then
  echo "    Secrets existants réutilisés."
  source "$SECRETS_FILE"
else
  PG_PASS="$(openssl rand -hex 16)"
  MONGO_PASS="$(openssl rand -hex 16)"
  JWT_SECRET="$(openssl rand -hex 32)"
  cat > "$SECRETS_FILE" <<EOF
PG_PASS=$PG_PASS
MONGO_PASS=$MONGO_PASS
JWT_SECRET=$JWT_SECRET
EOF
  chmod 600 "$SECRETS_FILE"
  echo "    Nouveaux secrets générés (mode 600)."
fi

# =====================================================================
# 6. docker-compose + bases (ADVERTISED en 127.0.0.1, restart auto)
# =====================================================================
echo "--> [6/9] Bases de données (Docker)"
cat > "$APP_DIR/docker-compose.yml" <<COMPOSE
services:
  postgres:
    image: postgres:15-alpine
    container_name: novacore-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: novacore
      POSTGRES_PASSWORD: ${PG_PASS}
      POSTGRES_DB: novacore
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks: [novacore-network]
  mongodb:
    image: mongo:6
    container_name: novacore-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: novacore
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
      MONGO_INITDB_DATABASE: novacore
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongo_data:/data/db
    networks: [novacore-network]
  redis:
    image: redis:7-alpine
    container_name: novacore-redis
    restart: unless-stopped
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
    networks: [novacore-network]
  kafka:
    image: apache/kafka:latest
    container_name: novacore-kafka
    restart: unless-stopped
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://127.0.0.1:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    ports:
      - "127.0.0.1:9092:9092"
    networks: [novacore-network]
volumes:
  postgres_data:
  mongo_data:
  redis_data:
networks:
  novacore-network:
    driver: bridge
COMPOSE

cd "$APP_DIR"
docker compose up -d
echo "    Attente de PostgreSQL..."
for i in $(seq 1 30); do
  if docker exec novacore-postgres pg_isready -U novacore &>/dev/null; then
    echo "    PostgreSQL prêt."; break
  fi
  sleep 2
done
docker exec novacore-postgres psql -U novacore -d novacore \
  -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";' || true

# =====================================================================
# 7. .env + build kernel
# =====================================================================
echo "--> [7/9] Build du kernel"
cat > "$APP_DIR/kernel/.env" <<ENV
PORT=3000
NODE_ENV=production
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=novacore
POSTGRES_PASSWORD=${PG_PASS}
POSTGRES_DB=novacore
MONGODB_URI=mongodb://novacore:${MONGO_PASS}@127.0.0.1:27017/novacore?authSource=admin
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
KAFKA_BROKERS=127.0.0.1:9092
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=3600s
ENV
chmod 600 "$APP_DIR/kernel/.env"

cd "$APP_DIR/kernel"
npm install
npm run build
chown -R novacore:novacore "$APP_DIR"

# =====================================================================
# 8. Service systemd
# =====================================================================
echo "--> [8/9] Service systemd"
cat > /etc/systemd/system/novacore-kernel.service <<UNIT
[Unit]
Description=NovaCore BOS Kernel (NestJS)
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=$APP_DIR/kernel
EnvironmentFile=$APP_DIR/kernel/.env
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=5
User=novacore
Group=novacore

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now novacore-kernel.service

# =====================================================================
# 9. Installateur graphique dans <domaine>/httpdocs/install/
# =====================================================================
echo "--> [9/9] Installateur graphique -> $WEBROOT/install/"
if [ -d "$WEBROOT" ]; then
  mkdir -p "$WEBROOT/install"
  cp -r "$APP_DIR/installer/"* "$WEBROOT/install/" 2>/dev/null || true
  # Réactiver install.php s'il était neutralisé
  if [ -f "$WEBROOT/install/install.php.done" ] && [ ! -f "$WEBROOT/install/install.php" ]; then
    mv "$WEBROOT/install/install.php.done" "$WEBROOT/install/install.php"
  fi
  # Droits Plesk : propriétaire = user du vhost
  VHOST_OWNER=$(stat -c '%U' "$WEBROOT")
  chown -R "$VHOST_OWNER":psaserv "$WEBROOT/install" 2>/dev/null || true
  echo "    Installateur copié. Accessible : https://$DOMAIN/install/"
else
  echo "    ATTENTION : $WEBROOT introuvable, installateur non copié."
fi

# =====================================================================
# RÉCAPITULATIF FINAL
# =====================================================================
KERNEL_STATUS=$(systemctl is-active novacore-kernel 2>/dev/null || echo "inconnu")
sleep 3
HEALTH=$(curl -s http://127.0.0.1:3000/health 2>/dev/null || echo "pas encore prêt")

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║           NOVACORE BOS - RÉCAPITULATIF            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "  Domaine détecté   : $DOMAIN"
echo ""
echo "  CONTENEURS DOCKER :"
docker compose -f "$APP_DIR/docker-compose.yml" ps --format "    {{.Name}}  ({{.Status}})" 2>/dev/null
echo ""
echo "  KERNEL            : $KERNEL_STATUS"
echo "  SANTÉ (/health)   : $HEALTH"
echo ""
echo "  ─────────────────────────────────────────────────"
echo "  ACCÈS :"
echo "    Installateur    : https://$DOMAIN/install/"
echo "    API kernel local: http://127.0.0.1:3000"
echo ""
echo "  PROCHAINE ÉTAPE (manuelle, dans Plesk) :"
echo "    Reverse-proxy nginx de $DOMAIN vers 127.0.0.1:3000"
echo "    pour exposer le kernel en https://$DOMAIN"
echo "  ─────────────────────────────────────────────────"
echo ""
echo "  Secrets  : $SECRETS_FILE (mode 600)"
echo "  Log      : $LOG"
echo "╚═══════════════════════════════════════════════════╝"

# =====================================================================
# AUTO-SUPPRESSION du script après succès
# =====================================================================
echo ""
echo "  Auto-suppression du script setup.sh..."
rm -f "$APP_DIR/setup.sh"
echo "  setup.sh supprimé. Déploiement terminé."
echo ""
