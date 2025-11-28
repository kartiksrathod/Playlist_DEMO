# 🚀 Admin Quick Start Guide

## Default Admin Credentials

**⚠️ CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

```
Email: admin@musicplaylist.com
Password: Admin@123456
Role: admin
```

---

## Create New Admin User

### Quick Method (Interactive)
```bash
cd /app/backend
node scripts/createAdmin.js
```
This creates an admin with default credentials above.

### Custom Credentials
```bash
cd /app/backend

ADMIN_NAME="Your Name" \
ADMIN_EMAIL="youremail@example.com" \
ADMIN_PASSWORD="YourSecurePassword123!" \
node scripts/createAdmin.js
```

### Example - Creating Multiple Admins
```bash
# First admin
ADMIN_NAME="John Doe" \
ADMIN_EMAIL="john@company.com" \
ADMIN_PASSWORD="JohnSecure#2024" \
node scripts/createAdmin.js

# Second admin
ADMIN_NAME="Jane Smith" \
ADMIN_EMAIL="jane@company.com" \
ADMIN_PASSWORD="JaneSecure#2024" \
node scripts/createAdmin.js
```

---

## Admin Login

**API Endpoint:**
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@musicplaylist.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "user-id",
    "name": "Admin User",
    "email": "admin@musicplaylist.com",
    "role": "admin",
    "isVerified": true
  }
}
```

---

## Using Admin Authentication

**In your backend routes:**

```javascript
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

// Admin-only route example
router.delete('/admin/users/:id', auth, adminAuth, (req, res) => {
  // Only admins can access this
  // req.admin contains admin user data
});
```

---

## Security Checklist

- [ ] Created your own admin account with secure email
- [ ] Used a strong password (12+ characters, mixed case, numbers, symbols)
- [ ] Deleted or disabled default admin account
- [ ] Secured `.env` files (not committed to Git)
- [ ] Changed JWT_SECRET in production
- [ ] Set up MongoDB Atlas IP whitelist

---

## Password Requirements

✅ **Minimum:** 6 characters (current setting)
✅ **Recommended:** 12+ characters with:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters (!@#$%^&*)

**Example strong passwords:**
- `MusicApp@2024!Secure`
- `Pl@y1ist#Adm1n2025`
- `SecureMusic!Pass123`

---

## Need Help?

**Common issues:**

1. **"Admin user already exists"**
   - You already created an admin with that email
   - Use a different email or delete the existing user

2. **"Authentication required"**
   - Make sure to include the JWT token in Authorization header
   - Format: `Authorization: Bearer YOUR_JWT_TOKEN`

3. **"Admin access required"**
   - The user account doesn't have admin role
   - Check user role in database

---

## Testing Admin Access

**Using curl:**
```bash
# Login as admin
TOKEN=$(curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@musicplaylist.com","password":"Admin@123456"}' \
  -s | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Use admin token for protected routes
curl -X GET http://localhost:8001/api/admin/route \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Remember

1. **Never share admin credentials**
2. **Change default passwords immediately**
3. **Use strong, unique passwords**
4. **Keep `.env` files secure**
5. **Monitor admin activity logs**

---

Created: 2025-11-28
Last Updated: 2025-11-28
