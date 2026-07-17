.PHONY: install run-kernel build-all test-all deploy up down

up:
	docker-compose up -d

down:
	docker-compose down

install:
	@echo "🧬 Installation de NovaCore BOS..."
	cd kernel && npm install

run-kernel:
	cd kernel && npm run start:dev

build-all:
	./scripts/build-all.sh

test-all:
	./scripts/test-all.sh

deploy:
	./scripts/deploy.sh
