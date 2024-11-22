
.PHONY: setup dev test deploy

setup:
    docker-compose build
    docker-compose run --rm frontend npm install
    docker-compose run --rm backend pip install -r requirements.txt

dev:
    docker-compose up

test:
    docker-compose run --rm frontend npm test
    docker-compose run --rm backend pytest

deploy:
    ./scripts/deploy.sh
