# 🏗️ MERN Stack Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                         │
│                    (React Frontend)                         │
│                     Port: 3000                              │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/AXIOS
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS SERVER                         │
│                    (Node.js Backend)                        │
│                     Port: 8001                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ROUTING LAYER                                       │  │
│  │  /api/* endpoints → statusRoutes                    │  │
│  │  /health → Health Check                              │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │  MIDDLEWARE LAYER                                    │  │
│  │  - CORS (Cross-Origin)                               │  │
│  │  - Body Parser (JSON)                                │  │
│  │  - Error Handler                                     │  │
│  │  - Request Logger                                    │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │  CONTROLLER LAYER                                    │  │
│  │  - statusController.js                               │  │
│  │    • getRoot()                                       │  │
│  │    • createStatusCheck()                             │  │
│  │    • getStatusChecks()                               │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │  MODEL LAYER (Mongoose ODM)                          │  │
│  │  - StatusCheck Schema                                │  │
│  │    • id: String (UUID)                               │  │
│  │    • client_name: String                             │  │
│  │    • timestamp: Date                                 │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
└─────────────────┼───────────────────────────────────────────┘
                  │ Mongoose
                  │ Connection
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                         │
│                   localhost:27017                           │
│                                                             │
│  Database: test_database                                   │
│  Collection: status_checks                                 │
│                                                             │
│  Documents: {                                              │
│    id: "uuid-string",                                      │
│    client_name: "string",                                  │
│    timestamp: ISODate("...")                               │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Example: Create Status Check

```
1. User Action (Frontend)
   └─> POST request to /api/status
       Body: { client_name: "MyClient" }

2. Express Server (Backend)
   ├─> CORS Middleware ✓
   ├─> Body Parser Middleware ✓
   ├─> Route Handler matches /api/status
   └─> Forwards to statusController.createStatusCheck()

3. Controller (Business Logic)
   ├─> Validates client_name exists
   ├─> Generates UUID for id
   ├─> Creates timestamp
   └─> Creates StatusCheck instance

4. Model Layer (Mongoose)
   ├─> Validates against schema
   ├─> Converts to MongoDB document
   └─> Saves to database

5. MongoDB
   ├─> Stores document in status_checks collection
   └─> Returns success confirmation

6. Response Flow (Back to Client)
   ├─> Controller formats response
   ├─> Returns JSON: {id, client_name, timestamp}
   └─> Frontend receives data
```

## Backend File Structure

```
backend/
│
├── config/
│   └── database.js          # MongoDB connection setup
│       ├── Loads environment variables
│       ├── Establishes Mongoose connection
│       └── Error handling
│
├── models/
│   └── StatusCheck.js       # Data schema definition
│       ├── Defines document structure
│       ├── Field validations
│       └── Mongoose model export
│
├── controllers/
│   └── statusController.js  # Business logic
│       ├── getRoot()         → Returns welcome message
│       ├── createStatusCheck() → Creates new status
│       └── getStatusChecks() → Retrieves all statuses
│
├── routes/
│   └── statusRoutes.js      # API endpoints
│       ├── GET  /api/        → getRoot
│       ├── GET  /api/health  → Health check
│       ├── POST /api/status  → createStatusCheck
│       └── GET  /api/status  → getStatusChecks
│
├── middleware/
│   └── errorHandler.js      # Global error handling
│       ├── Catches all errors
│       ├── Formats error response
│       └── Logs error details
│
├── utils/
│   └── logger.js            # Logging utility
│       ├── info()
│       ├── error()
│       ├── warn()
│       └── debug()
│
└── server.js                # Application entry point
    ├── Loads environment
    ├── Connects to MongoDB
    ├── Sets up middleware
    ├── Registers routes
    ├── Starts Express server
    └── Listens on port 8001
```

## Frontend Structure

```
frontend/
│
├── public/
│   └── index.html           # HTML template
│
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       └── ... (30+ components)
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── (empty - ready for custom hooks)
│   │
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   │
│   ├── App.js               # Main application component
│   │   ├── Routing setup
│   │   ├── API integration
│   │   └── Component rendering
│   │
│   ├── index.js             # React entry point
│   ├── App.css              # Application styles
│   └── index.css            # Global styles (Tailwind)
│
└── package.json             # Dependencies
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (React)                                   │
│                                                     │
│  ┌───────────────┐                                 │
│  │   App.js      │                                 │
│  │               │                                 │
│  │  - Home comp  │                                 │
│  │  - API calls  │                                 │
│  └───────┬───────┘                                 │
│          │                                          │
│          │ Axios HTTP                               │
└──────────┼──────────────────────────────────────────┘
           │
           │ REACT_APP_BACKEND_URL
           │ http://localhost:8001
           │
┌──────────▼──────────────────────────────────────────┐
│  BACKEND (Express.js)                               │
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │  server.js (Main)                   │           │
│  │  ├── CORS Middleware                │           │
│  │  ├── Body Parser                    │           │
│  │  ├── Router: /api/*                 │           │
│  │  └── Error Handler                  │           │
│  └─────────────┬───────────────────────┘           │
│                │                                    │
│  ┌─────────────▼───────────────────────┐           │
│  │  statusRoutes.js                    │           │
│  │  ├── GET  /api/                     │           │
│  │  ├── GET  /api/health               │           │
│  │  ├── POST /api/status               │           │
│  │  └── GET  /api/status               │           │
│  └─────────────┬───────────────────────┘           │
│                │                                    │
│  ┌─────────────▼───────────────────────┐           │
│  │  statusController.js                │           │
│  │  ├── Business Logic                 │           │
│  │  ├── Data Validation                │           │
│  │  └── Response Formatting            │           │
│  └─────────────┬───────────────────────┘           │
│                │                                    │
│  ┌─────────────▼───────────────────────┐           │
│  │  StatusCheck Model (Mongoose)       │           │
│  │  ├── Schema Validation              │           │
│  │  └── DB Operations                  │           │
│  └─────────────┬───────────────────────┘           │
└────────────────┼─────────────────────────────────────┘
                 │
                 │ Mongoose ODM
                 │ mongodb://localhost:27017
                 │
┌────────────────▼─────────────────────────────────────┐
│  MONGODB                                             │
│                                                      │
│  Database: test_database                            │
│  Collection: status_checks                          │
│                                                      │
│  Schema: {                                          │
│    id: String (UUID)                                │
│    client_name: String (required)                   │
│    timestamp: Date (auto)                           │
│  }                                                   │
└──────────────────────────────────────────────────────┘
```

## API Contract

### 1. Root Endpoint
```
GET /api/
Response: 200 OK
{
  "message": "Hello World"
}
```

### 2. Health Check
```
GET /api/health
Response: 200 OK
{
  "status": "OK",
  "timestamp": "2024-11-24T20:15:00.000Z"
}
```

### 3. Create Status Check
```
POST /api/status
Content-Type: application/json

Request Body:
{
  "client_name": "MyClient"
}

Response: 201 Created
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "client_name": "MyClient",
  "timestamp": "2024-11-24T20:15:00.000Z"
}

Error Response: 400 Bad Request
{
  "message": "client_name is required"
}
```

### 4. Get All Status Checks
```
GET /api/status
Response: 200 OK
[
  {
    "id": "uuid-1",
    "client_name": "Client1",
    "timestamp": "2024-11-24T20:15:00.000Z"
  },
  {
    "id": "uuid-2",
    "client_name": "Client2",
    "timestamp": "2024-11-24T20:15:30.000Z"
  }
]
```

## Environment Configuration

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
PORT=8001
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI Framework |
| | React Router v7 | Client-side routing |
| | Axios | HTTP client |
| | Tailwind CSS | Styling |
| | Radix UI | Component library |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web framework |
| | Mongoose | MongoDB ODM |
| | CORS | Cross-origin support |
| | UUID | Unique ID generation |
| **Database** | MongoDB | NoSQL database |
| **DevOps** | Supervisor | Process management |
| | Yarn | Package manager |

## Design Patterns

### 1. **MVC (Model-View-Controller)**
- **Model**: Mongoose schemas (data layer)
- **View**: React components (presentation layer)
- **Controller**: Express controllers (business logic)

### 2. **Separation of Concerns**
- Each layer has a specific responsibility
- Loose coupling between layers
- Easy to test and maintain

### 3. **RESTful API Design**
- Standard HTTP methods (GET, POST)
- Resource-based URLs
- Proper status codes

### 4. **Middleware Pattern**
- Request processing pipeline
- Modular and reusable
- Error handling centralized

## Scalability Considerations

### Current Capacity
- ✅ Handles multiple concurrent requests
- ✅ Connection pooling (MongoDB)
- ✅ Async/await for non-blocking I/O

### Future Enhancements
- 🔄 Add caching layer (Redis)
- 🔄 Implement rate limiting
- 🔄 Load balancing (multiple instances)
- 🔄 Horizontal scaling with MongoDB replica sets

---

**Last Updated:** November 24, 2024
**Version:** 1.0.0 (MERN Stack)
