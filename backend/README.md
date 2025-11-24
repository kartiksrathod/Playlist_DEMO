# Backend - MERN Stack API

Professional Node.js/Express backend with MongoDB.

## Structure

```
/backend
  /config        - Database and configuration files
  /controllers   - Business logic and request handlers
  /middleware    - Custom middleware (error handling, auth, etc.)
  /models        - Mongoose schemas and models
  /routes        - API route definitions
  /utils         - Helper functions and utilities
  server.js      - Main application entry point
  package.json   - Dependencies and scripts
```

## Installation

```bash
cd backend
npm install
# or
yarn install
```

## Running

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

Create a `.env` file with:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
PORT=8001
NODE_ENV=development
```

## API Endpoints

### Root
- `GET /api/` - Hello World message

### Status Checks
- `POST /api/status` - Create new status check
- `GET /api/status` - Get all status checks

### Health
- `GET /health` - Server health check
