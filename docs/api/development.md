# Optimized Docker Development Workflow for Windows

## Key Issues with Windows + Docker
1. File system performance degradation with NTFS -> ext4 translations
2. Line ending differences (CRLF vs LF)
3. Permissions issues
4. Slow npm/node_modules operations
5. Volume mount performance impact

## Optimized Solution

### 1. Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: 
      context: ./frontend
      target: development
    ports:
      - "3000:3000"
    # Use named volume instead of bind mount for node_modules
    volumes:
      - frontend_node_modules:/app/node_modules
      - ./frontend:/app:cached
    environment:
      - CHOKIDAR_USEPOLLING=true  # Better hot-reload on Windows
      - WATCHPACK_POLLING=true     # Better webpack watching
    
  backend:
    build: 
      context: ./backend
      target: development
    ports:
      - "8000:8000"
    volumes:
      - backend_venv:/app/.venv    # Store virtual env in volume
      - ./backend:/app:cached
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  frontend_node_modules:
  backend_venv:
  redis_data:
```

### 2. Optimized Dockerfiles

```dockerfile
# frontend/Dockerfile
# Multi-stage build with development and production targets
FROM node:18-alpine as base

WORKDIR /app

# Development stage
FROM base as development

# Copy package files
COPY package*.json ./

# Install dependencies in the container
RUN npm ci

# Copy application code
COPY . .

# Start development server
CMD ["npm", "run", "dev"]

# Production stage
FROM base as production

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

# Use nginx for production
FROM nginx:alpine as production-serve
COPY --from=production /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

```dockerfile
# backend/Dockerfile
FROM python:3.9-slim as base

WORKDIR /app

# Development stage
FROM base as development

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment in the container
RUN python -m venv .venv
ENV PATH="/app/.venv/bin:$PATH"

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--reload"]
```

### 3. .gitignore Configuration
```gitignore
# Node
node_modules/
dist/
build/

# Python
__pycache__/
*.py[cod]
.venv/
*.egg-info/

# Environment
.env
.env.local

# Docker
.docker/
```

### 4. .dockerignore Configuration
```dockerignore
.git
.gitignore
node_modules
.venv
__pycache__
*.pyc
.env
.env.*
```

### 5. VSCode Configuration
```json
// .vscode/settings.json
{
  "remote.containers.cacheVolumes": true,
  "files.eol": "\n",
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.venv/**": true
  }
}
```

### 6. Development Workflow Commands

```makefile
# Makefile
.PHONY: setup dev build clean

# Initial setup
setup:
	docker-compose build
	docker-compose run --rm frontend npm install
	docker-compose run --rm backend pip install -r requirements.txt

# Start development environment
dev:
	docker-compose up

# Clean everything and rebuild
clean:
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

# Build production images
build:
	docker-compose -f docker-compose.prod.yml build

# Run tests
test:
	docker-compose run --rm frontend npm test
	docker-compose run --rm backend pytest
```

## Development Workflow Steps

1. **Initial Repository Setup**
```bash
# Clone repository to WSL2 directory for better performance
mkdir -p /home/username/projects
cd /home/username/projects
git clone <repository-url>
cd <project-directory>

# Run setup
make setup
```

2. **Daily Development**
```bash
# Start development environment
make dev

# Run in separate terminal for logs
docker-compose logs -f
```

3. **Installing New Dependencies**
```bash
# Frontend dependencies
docker-compose exec frontend npm install <package-name>

# Backend dependencies
docker-compose exec backend pip install <package-name>
docker-compose exec backend pip freeze > requirements.txt
```

## Best Practices for Windows Development

1. **Use WSL2**
   - Store project files in WSL2 filesystem
   - Run Docker Desktop with WSL2 backend
   - Use VSCode with Remote-WSL extension

2. **Volume Mounting**
   - Use named volumes for dependency directories
   - Use cached mount option for source code
   - Avoid binding node_modules directory

3. **Performance Optimization**
   - Enable buildkit: `export DOCKER_BUILDKIT=1`
   - Use .dockerignore effectively
   - Implement multi-stage builds
   - Cache dependencies in volumes

4. **File Watching**
   - Use polling for file watching
   - Configure appropriate exclusions
   - Use debounce/throttle where appropriate

## Troubleshooting Common Issues

1. **Slow NPM Operations**
   Solution: Use named volume for node_modules

2. **File Watch Not Working**
   Solution: Enable CHOKIDAR_USEPOLLING

3. **Line Ending Issues**
   Solution: Configure Git to use LF
   ```bash
   git config --global core.autocrlf input
   ```

4. **Permission Issues**
   Solution: Use appropriate user in Dockerfile
   ```dockerfile
   RUN adduser -D appuser
   USER appuser
   ```
