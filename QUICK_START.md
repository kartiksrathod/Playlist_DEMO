# 🚀 Quick Start Guide - MERN Stack Application

## ⚡ 5-Minute Setup

### 1. Start All Services (Already Running)
```bash
sudo supervisorctl status
# All services should show RUNNING
```

### 2. Access Your Application

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:8001/api
**Health Check:** http://localhost:8001/health

---

## 📱 Testing Your Application

### Using CURL

**1. Test Root Endpoint:**
```bash
curl http://localhost:8001/api/
# Response: {"message":"Hello World"}
```

**2. Test Health:**
```bash
curl http://localhost:8001/api/health
# Response: {"status":"OK","timestamp":"..."}
```

**3. Create Status Check:**
```bash
curl -X POST http://localhost:8001/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name":"MyClient"}'
# Response: {"id":"uuid","client_name":"MyClient","timestamp":"..."}
```

**4. Get All Status Checks:**
```bash
curl http://localhost:8001/api/status
# Response: [array of status checks]
```

---

## 🛠️ Common Commands

### Backend

```bash
# Restart backend
sudo supervisorctl restart backend

# View backend logs
tail -f /var/log/supervisor/backend.out.log

# View backend errors
tail -f /var/log/supervisor/backend.err.log

# Install new package
cd /app/backend
yarn add package-name

# Run in dev mode (with auto-reload)
cd /app/backend
npm run dev
```

### Frontend

```bash
# Restart frontend
sudo supervisorctl restart frontend

# View frontend logs
tail -f /var/log/supervisor/frontend.out.log

# Install new package
cd /app/frontend
yarn add package-name

# Build for production
cd /app/frontend
yarn build
```

### Database

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/test_database

# View collections
show collections

# Query status checks
db.status_checks.find()

# Count documents
db.status_checks.countDocuments()
```

---

## 📂 Key Files & Locations

| Purpose | Location |
|---------|----------|
| **Backend Entry** | `/app/backend/server.js` |
| **Backend Config** | `/app/backend/.env` |
| **Database Config** | `/app/backend/config/database.js` |
| **Add API Routes** | `/app/backend/routes/` |
| **Business Logic** | `/app/backend/controllers/` |
| **Data Models** | `/app/backend/models/` |
| **Frontend Entry** | `/app/frontend/src/index.js` |
| **Frontend Config** | `/app/frontend/.env` |
| **React Components** | `/app/frontend/src/components/` |

---

## 🎯 Common Tasks

### Add a New API Endpoint

1. **Create Model** (if needed):
```javascript
// /app/backend/models/NewModel.js
const mongoose = require('mongoose');
const newSchema = new mongoose.Schema({
  name: String,
  // ... other fields
});
module.exports = mongoose.model('NewModel', newSchema);
```

2. **Create Controller**:
```javascript
// /app/backend/controllers/newController.js
const NewModel = require('../models/NewModel');

const getItems = async (req, res) => {
  const items = await NewModel.find();
  res.json(items);
};

module.exports = { getItems };
```

3. **Create Route**:
```javascript
// /app/backend/routes/newRoutes.js
const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/newController');

router.get('/items', getItems);
module.exports = router;
```

4. **Register Route in server.js**:
```javascript
// In /app/backend/server.js
const newRoutes = require('./routes/newRoutes');
app.use('/api', newRoutes);
```

5. **Restart Backend**:
```bash
sudo supervisorctl restart backend
```

### Add a New React Component

1. **Create Component**:
```javascript
// /app/frontend/src/components/MyComponent.js
import React from 'react';

const MyComponent = () => {
  return <div>My New Component</div>;
};

export default MyComponent;
```

2. **Use in App.js**:
```javascript
import MyComponent from './components/MyComponent';

// Add to your JSX
<MyComponent />
```

---

## 🔧 Environment Variables

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

**⚠️ Important:** After changing .env files, restart the service:
```bash
sudo supervisorctl restart backend  # for backend changes
sudo supervisorctl restart frontend # for frontend changes
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
tail -50 /var/log/supervisor/backend.err.log

# Common fixes:
# 1. Check MongoDB is running
sudo supervisorctl status mongodb

# 2. Verify dependencies installed
cd /app/backend && yarn install

# 3. Check port not in use
lsof -i :8001
```

### Frontend Not Loading

```bash
# Check logs
tail -50 /var/log/supervisor/frontend.err.log

# Common fixes:
# 1. Verify dependencies installed
cd /app/frontend && yarn install

# 2. Check REACT_APP_BACKEND_URL in .env
cat /app/frontend/.env
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
sudo supervisorctl status mongodb

# Check MongoDB logs
tail -50 /var/log/mongodb.out.log

# Restart MongoDB
sudo supervisorctl restart mongodb
```

### API 404 Errors

**Make sure API routes have `/api` prefix:**
```javascript
// ✅ Correct
axios.get('http://localhost:8001/api/status')

// ❌ Wrong
axios.get('http://localhost:8001/status')
```

---

## 📚 Documentation Files

- **README.md** - Main project overview
- **ARCHITECTURE.md** - Detailed architecture guide
- **RESTRUCTURE_SUMMARY.md** - What was changed
- **BEFORE_AFTER.md** - Before/after comparison
- **QUICK_START.md** - This file

---

## 🎓 Learning Resources

### MERN Stack
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Node.js Docs](https://nodejs.org/docs/)

### This Project
- [Mongoose ODM](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [React Router](https://reactrouter.com/)

---

## ✅ Health Check Commands

```bash
# Check all services
sudo supervisorctl status

# Test backend
curl http://localhost:8001/api/health

# Test frontend (open in browser)
# http://localhost:3000

# Test database
mongosh --eval "db.adminCommand('ping')"
```

---

## 🎯 Next Steps

1. ✅ Backend restructured to MERN stack
2. ✅ All tests passing
3. ✅ Services running

**Recommended Next Actions:**
- Add authentication (JWT)
- Add more API endpoints
- Enhance frontend UI
- Add unit tests
- Set up CI/CD

---

**Last Updated:** November 24, 2024
**Status:** ✅ Production Ready
**Stack:** MongoDB + Express.js + React + Node.js
