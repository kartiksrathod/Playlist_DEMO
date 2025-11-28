# 🔒 Security Setup Guide

## ✅ Security Measures Implemented

### 1. Environment Variables Protection

**What was done:**
- ✅ Created `.gitignore` files to prevent committing sensitive data
- ✅ Removed `.env` files from Git tracking
- ✅ Created `.env.example` template files (safe to commit)

**Files protected:**
- `/app/backend/.env` - Contains MongoDB credentials, JWT secret
- `/app/frontend/.env` - Contains backend URL

**⚠️ NEVER commit these files to GitHub or any public repository!**

---

### 2. Admin User System

#### Creating Admin Users

**Default Admin Credentials (CHANGE THESE!):**
- Email: `admin@musicplaylist.com`
- Password: `Admin@123456`
- Role: `admin`

#### How to Create Custom Admin Users:

**Method 1: Using Default Credentials**
```bash
cd /app/backend
node scripts/createAdmin.js
```

**Method 2: Using Custom Credentials**
```bash
cd /app/backend
ADMIN_NAME="Your Name" \
ADMIN_EMAIL="your.email@example.com" \
ADMIN_PASSWORD="YourSecurePassword123!" \
node scripts/createAdmin.js
```

**Example:**
```bash
ADMIN_NAME="John Doe" \
ADMIN_EMAIL="john@company.com" \
ADMIN_PASSWORD="SuperSecure#2024" \
node scripts/createAdmin.js
```

#### Admin Features:
- ✅ Auto-verified email (no verification needed)
- ✅ Role: `admin` (different from regular users)
- ✅ Can be used with admin-protected routes

---

### 3. Using Admin Authentication in Routes

**Example of protecting admin routes:**

```javascript
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Regular authenticated route
router.get('/profile', auth, getProfile);

// Admin-only route
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.delete('/admin/user/:id', auth, adminAuth, deleteUser);
```

---

### 4. Environment Variables - What You Need

#### Backend `.env` (Location: `/app/backend/.env`)

**Required Variables:**
```env
# MongoDB (NEVER commit these!)
MONGO_URL=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
DB_NAME=your_database_name

# Server
PORT=8001
NODE_ENV=production

# JWT Secret (Generate a strong random string!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# CORS
CORS_ORIGINS=https://yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

#### Frontend `.env` (Location: `/app/frontend/.env`)

```env
REACT_APP_BACKEND_URL=https://your-backend-api.com
```

---

### 5. For Deployment - Environment Variables Setup

**When deploying to production platforms (Vercel, Heroku, Railway, etc.):**

1. **DO NOT** include `.env` files in your deployment
2. **SET** environment variables in your hosting platform's dashboard
3. **USE** the platform's environment variable settings

**Example for common platforms:**

**Vercel:**
- Go to Project Settings → Environment Variables
- Add each variable one by one

**Heroku:**
```bash
heroku config:set MONGO_URL="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
```

**Railway:**
- Go to Variables tab
- Add each environment variable

---

### 6. Security Checklist Before Deployment

- [ ] `.env` files are in `.gitignore`
- [ ] `.env` files removed from Git history
- [ ] Changed default admin password
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set in hosting platform
- [ ] CORS_ORIGINS set to your production domain
- [ ] NODE_ENV set to "production"
- [ ] All sensitive data stored in environment variables

---

### 7. How to Generate Secure Secrets

**For JWT_SECRET:**

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 64

# Method 3: Online (use trusted sites only)
# Visit: https://randomkeygen.com/
```

---

### 8. MongoDB Atlas Security

**What you should set:**

1. **Network Access:**
   - For development: `0.0.0.0/0` (allow all)
   - For production: Add specific IP addresses of your hosting platform

2. **Database User:**
   - Use strong passwords (20+ characters)
   - Don't use default usernames like "admin"
   - Use different credentials for dev/staging/production

3. **Connection String:**
   - Keep it secret (never commit to Git)
   - Rotate passwords periodically
   - Use environment variables

---

### 9. Current Admin User

**⚠️ IMPORTANT: Default admin created during setup**

Email: `admin@musicplaylist.com`
Password: `Admin@123456`

**🔴 YOU MUST CHANGE THIS PASSWORD IMMEDIATELY!**

To create a new admin with your own credentials:
```bash
cd /app/backend
ADMIN_EMAIL="youremail@example.com" \
ADMIN_PASSWORD="YourStrongPassword!" \
node scripts/createAdmin.js
```

---

### 10. Regular Security Maintenance

**Monthly:**
- [ ] Review admin users
- [ ] Check access logs
- [ ] Update dependencies (`yarn upgrade`)

**Quarterly:**
- [ ] Rotate JWT_SECRET
- [ ] Change admin passwords
- [ ] Review MongoDB access logs

**Annually:**
- [ ] Full security audit
- [ ] Update all secrets
- [ ] Review user permissions

---

## 🆘 If Credentials Are Compromised

1. **Immediately change:**
   - MongoDB password in Atlas
   - Update MONGO_URL in environment variables
   - Rotate JWT_SECRET
   - Change all admin passwords

2. **Revoke access:**
   - Delete compromised users
   - Clear all active sessions

3. **Update deployment:**
   - Redeploy with new environment variables
   - Force all users to re-login

---

## 📞 Need Help?

If you need to:
- Create additional admin users
- Implement more security features
- Set up role-based access control (RBAC)
- Add two-factor authentication (2FA)

Just ask!

---

**🔒 Security is not a one-time setup - it's an ongoing process!**
