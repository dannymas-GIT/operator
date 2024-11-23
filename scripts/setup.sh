#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[+]${NC} $1"
}

print_error() {
    echo -e "${RED}[!]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[*]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_status "Docker and Docker Compose found"
}

# Create backend directory structure
setup_backend_directory() {
    print_status "Setting up backend directory structure..."
    mkdir -p backend/{app/{models,routes,services,utils,config},agents,data,logs}
}

# Create Python files
create_python_files() {
    print_status "Creating Python files..."
    
    # Create __init__.py
    cat > backend/app/__init__.py << EOL
# Initialize FastAPI app
from .main import app
EOL

    # Create main.py
    cat > backend/app/main.py << EOL
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Operator Backend",
    description="Backend API for the Operator AI Agent System",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Operator Backend",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "agents": "operational"
        }
    }
EOL

    # Create settings.py
    cat > backend/app/config/settings.py << EOL
from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Operator"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # AI Service API Keys
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    
    # Database
    DATABASE_URL: Optional[str] = os.getenv(
        "DATABASE_URL", "sqlite:///./operator.db"
    )
    
    class Config:
        case_sensitive = True

settings = Settings()
EOL

    # Create base.py
    cat > backend/app/models/base.py << EOL
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime

Base = declarative_base()

class TimeStampedBase(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
EOL

    touch backend/config/config.yaml
    touch backend/.env
}

# Create requirements.txt
create_requirements() {
    print_status "Creating requirements.txt..."
    cat > backend/requirements.txt << EOL
fastapi>=0.115.5
uvicorn>=0.32.1
python-dotenv>=1.0.1
sqlalchemy>=2.0.36
psycopg2-binary>=2.9.10
pydantic>=2.10.1
pydantic-settings>=2.0.0
langchain>=0.3.7
openai>=1.55.0
anthropic>=0.39.0
PyYAML>=6.0.2
EOL
}

# Create .env file template
create_env_template() {
    print_status "Creating .env template..."
    # Generate a secure secret key
    SECURE_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    
    # Create in root directory, not backend
    cat > .env << EOL
# Security
SECRET_KEY=${SECURE_KEY}

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/operator

# AI Service API Keys
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
EOL
}

# Create Dockerfile
create_dockerfile() {
    print_status "Creating Dockerfile..."
    cat > backend/Dockerfile << EOL
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
EOL
}

# Create docker-compose.yml
create_docker_compose() {
    print_status "Creating docker-compose.yml..."
    cat > docker-compose.yml << EOL
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/operator
      - SECRET_KEY=\${SECRET_KEY:-your-secret-key-here}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
    depends_on:
      - db
    networks:
      - operator_network

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=operator
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - operator_network

volumes:
  postgres_data:

networks:
  operator_network:
    driver: bridge
EOL
}

# Display directory structure
show_structure() {
    print_status "Created the following structure:"
    echo "."
    echo "├── backend/"
    echo "│   ├── app/"
    echo "│   │   ├── __init__.py"
    echo "│   │   ├── main.py"
    echo "│   │   ├── models/"
    echo "│   │   ├── routes/"
    echo "│   │   ├── services/"
    echo "│   │   └── utils/"
    echo "│   ├── agents/"
    echo "│   ├── config/"
    echo "│   │   └── config.yaml"
    echo "│   ├── data/"
    echo "│   ├── logs/"
    echo "│   ├── .env"
    echo "│   ├── Dockerfile"
    echo "│   └── requirements.txt"
    echo "└── docker-compose.yml"
}

# Main setup process
main() {
    print_status "Starting setup process..."
    
    # Check Docker installation
    check_docker
    
    # Setup directory structure
    setup_backend_directory
    
    # Create Python files
    create_python_files
    
    # Create requirements.txt
    create_requirements
    
    # Create .env template
    create_env_template
    
    # Create Dockerfile
    create_dockerfile
    
    # Create docker-compose.yml
    create_docker_compose
    
    print_status "Setup completed successfully!"
    print_warning "Don't forget to:"
    print_warning "1. Configure your .env file with necessary API keys"
    print_warning "2. Run 'docker-compose up --build' to start the services"
    
    # Show the created structure
    show_structure
}

# Run main setup
main
