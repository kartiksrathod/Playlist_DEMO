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

// Get admin credentials from environment variables or use defaults
const adminName = process.env.ADMIN_NAME || 'Admin User';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

async function createAdmin() {
  try {
    // Build MongoDB URL
    const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'music_streaming_app';
    const fullMongoURL = `${mongoURL}/${dbName}`;
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await mongoose.connect(fullMongoURL);
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
