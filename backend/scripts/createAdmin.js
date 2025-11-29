#!/usr/bin/env node

/**
 * Admin User Creation Script
 * 
 * This script creates an admin user in the database.
 * 
 * Usage:
 *   node scripts/createAdmin.js
 * 
 * Or with custom credentials:
 *   ADMIN_NAME="Admin Name" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="yourpassword" node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Database connection URL
const getMongoURL = () => {
  let mongoURL = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  
  if (mongoURL.includes('mongodb+srv://') || mongoURL.includes('mongodb://')) {
    const urlParts = mongoURL.split('?');
    const baseUrl = urlParts[0];
    const queryParams = urlParts[1] || '';
    const pathIndex = baseUrl.lastIndexOf('/');
    const urlWithoutDb = baseUrl.substring(0, pathIndex + 1);
    mongoURL = queryParams ? `${urlWithoutDb}${dbName}?${queryParams}` : `${urlWithoutDb}${dbName}`;
  } else {
    mongoURL = `${mongoURL}/${dbName}`;
  }
  
  return mongoURL;
};

// Get admin credentials from environment variables or use defaults
const adminName = process.env.ADMIN_NAME || 'Admin User';
const adminEmail = process.env.ADMIN_EMAIL || 'kartiksrathod07@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Sheshi@1234';

async function createAdmin() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await mongoose.connect(getMongoURL());
    console.log('✅ Connected to database\n');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('\n💡 To update password, delete the existing user first.');
      
      // Close connection
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true // Admin users are auto-verified
    });

    await adminUser.save();
    
    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminEmail);
    console.log('👤 Name:', adminName);
    console.log('🔑 Role: admin');
    console.log('✔️  Verified: true');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔒 Keep these credentials secure and do not share them.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Done!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
createAdmin();
