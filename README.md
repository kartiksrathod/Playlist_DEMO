# MERN Stack Application

A professional full-stack application built with MongoDB, Express.js, React, and Node.js.

## 📁 Project Structure

```
/app
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers & business logic
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── server.js        # Main entry point
│   └── package.json     # Backend dependencies
│
├── frontend/            # React application
│   ├── public/         # Static files
│   ├── src/            # React components & logic
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions
│   └── package.json    # Frontend dependencies
│
└── tests/              # Test files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote)
- Yarn package manager

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
yarn install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
yarn install
```

### Running the Application

**Backend (Port 8001):**
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

**Frontend (Port 3000):**
```bash
cd frontend
yarn start
```

## 🔧 Configuration

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
PORT=8001
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📡 API Endpoints

### Status Checks
- `GET /api/` - Root endpoint
- `POST /api/status` - Create status check
- `GET /api/status` - Get all status checks

### Health
- `GET /health` - Server health check

## 🏗️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

**Frontend:**
- React 19
- React Router v7
- Axios for API calls
- Tailwind CSS
- Radix UI components

## 📝 Development Notes

- Backend runs on port **8001**
- Frontend runs on port **3000**
- All API routes are prefixed with `/api`
- MongoDB connection uses Mongoose ODM
- Professional folder structure following MVC pattern
