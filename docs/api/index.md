# API Documentation

## Authentication
TBD - Authentication system details

## Endpoints

### Tasks
- POST /api/tasks
  - Create a new automation task
  - Request body: { type: string, input: any }
  - Response: { success: boolean, data?: any, error?: string }

### Agents
- GET /api/agents
  - List available agents
  - Response: Array of Agent objects

## Data Models

### Agent
