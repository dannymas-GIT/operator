.PHONY: setup dev build clean

# Initial setup
setup:
	docker compose build
	docker compose run --rm frontend npm install
	docker compose run --rm backend pip install -r requirements.txt

# Start development environment
dev:
	docker compose up

# Clean everything and rebuild
clean:
	docker compose down -v
	docker system prune -f
	docker volume prune -f

# Build production images
build:
	docker compose -f docker-compose.prod.yml build
