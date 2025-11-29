const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    let mongoURL = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME;
    
    if (!mongoURL) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    
    if (!dbName) {
      throw new Error('DB_NAME environment variable is not defined');
    }
    
    // Append database name to MongoDB URL
    // Handle both mongodb:// and mongodb+srv:// URLs
    const urlParts = mongoURL.split('?');
    const baseUrl = urlParts[0];
    const queryParams = urlParts[1] ? `?${urlParts[1]}` : '';
    
    // Ensure base URL ends with / before appending database name
    const urlWithDb = baseUrl.endsWith('/') ? `${baseUrl}${dbName}${queryParams}` : `${baseUrl}/${dbName}${queryParams}`;
    
    await mongoose.connect(urlWithDb);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', dbName);
    console.log('🔗 Connection:', urlWithDb.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
