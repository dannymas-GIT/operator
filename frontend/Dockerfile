FROM node:18-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install \
    class-variance-authority \
    clsx \
    tailwind-merge \
    lucide-react \
    @radix-ui/react-alert-dialog \
    @types/node

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3001

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 