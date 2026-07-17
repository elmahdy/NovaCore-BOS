# 🧬 NovaCore BOS - Business Operating System

## Vision
NovaCore BOS est une plateforme d'entreprise inspirée de la biologie cellulaire. Chaque module métier est une cellule qui se différencie à partir d'une cellule souche par l'activation de gènes.

## Architecture
- **Kernel (Noyau)** : ADN du système, moteur de génération et d'orchestration
- **Cells (Cellules)** : Microservices conteneurisés (CRM, Stock, HR, etc.)
- **Genes (Gènes)** : Fonctionnalités réutilisables (CRUD, Workflow, IA, etc.)
- **Evolution Engine** : Générateur de code à partir des gènes activés
- **Double écriture** : PostgreSQL + MongoDB
- **Orchestration** : Kubernetes

## Installation rapide
```bash
# Cloner
git clone https://github.com/votre-compte/novacore-bos.git
cd novacore-bos

# Lancer les bases de données
docker-compose up -d

# Lancer l'installateur
make install

# Démarrer le noyau
make run-kernel
```

## Documentation
- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Déploiement](docs/deployment.md)

## Licence
MIT
