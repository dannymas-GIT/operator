import os
from pathlib import Path
import shutil

def create_directory(path):
    try:
        Path(path).mkdir(parents=True, exist_ok=True)
    except PermissionError:
        print(f"Permission denied: {path}")
        print("Trying to create directory in a different location...")
        new_path = os.path.join(os.path.expanduser("~"), os.path.basename(path))
        Path(new_path).mkdir(parents=True, exist_ok=True)
        print(f"Directory created at: {new_path}")

def create_file(path, content=''):
    try:
        with open(path, 'w') as f:
            f.write(content)
    except PermissionError:
        print(f"Permission denied: {path}")
        print("Trying to create file in a different location...")
        new_path = os.path.join(os.path.expanduser("~"), os.path.basename(path))
        with open(new_path, 'w') as f:
            f.write(content)
        print(f"File created at: {new_path}")

def setup_project():
    # Project root structure
    project_root = 'ai-explosion-template'
    create_directory(project_root)

    directories = [
        # ... (rest of the directories remain the same)
    ]

    for directory in directories:
        create_directory(os.path.join(project_root, directory))

    files = {
        os.path.join(project_root, '.devcontainer', 'devcontainer.json'): '{}',
        os.path.join(project_root, '.devcontainer', 'docker-compose.yml'): '',
        os.path.join(project_root, '.devcontainer', 'Dockerfile'): '',
        os.path.join(project_root, 'backend', 'Dockerfile'): '',
        os.path.join(project_root, 'backend', 'requirements.txt'): '',
        os.path.join(project_root, 'backend', 'app', 'main.py'): '''
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
''',
        os.path.join(project_root, 'frontend', 'Dockerfile'): '',
        os.path.join(project_root, 'frontend', 'package.json'): '{}',
        os.path.join(project_root, 'frontend', 'tsconfig.json'): '{}',
        os.path.join(project_root, 'frontend', 'vite.config.ts'): '',
        os.path.join(project_root, 'frontend', 'tailwind.config.js'): '',
        os.path.join(project_root, 'infra', 'docker', 'nginx', 'conf.d'): '',
        os.path.join(project_root, 'infra', 'docker', 'development'): '',
        os.path.join(project_root, 'infra', 'terraform'): '',
        os.path.join(project_root, 'scripts', 'setup.sh'): '',
        os.path.join(project_root, 'scripts', 'deploy.sh'): '',
        os.path.join(project_root, 'docs', 'api', 'index.md'): '',
        os.path.join(project_root, 'docs', 'development', 'setup.md'): '',
        os.path.join(project_root, 'docs', 'deployment', 'index.md'): '',
        os.path.join(project_root, '.env.example'): '',
        os.path.join(project_root, '.gitignore'): '',
        os.path.join(project_root, 'docker-compose.yml'): '',
        os.path.join(project_root, 'docker-compose.prod.yml'): '',
        os.path.join(project_root, 'Makefile'): '''
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
''',
        os.path.join(project_root, 'README.md'): '''
# AI-Explosion

This is a web application that provides an educational platform focused on ethical hacking practices.
'''
    }

    for file_path, content in files.items():
        create_file(file_path, content)

    print("Project scaffolding complete!")

if __name__ == "__main__":
    setup_project()