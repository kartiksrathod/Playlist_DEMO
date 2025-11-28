const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    let mongoURL = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME;
    
    // If MONGO_URL already contains a database name in the path, replace it
    // Otherwise, append the database name
    if (mongoURL.includes('mongodb+srv://') || mongoURL.includes('mongodb://')) {
      // Parse the URL to replace or add database name
      const urlParts = mongoURL.split('?');
      const baseUrl = urlParts[0];
      const queryParams = urlParts[1] || '';
      
      // Remove any existing database name from the path
      const pathIndex = baseUrl.lastIndexOf('/');
      const urlWithoutDb = baseUrl.substring(0, pathIndex + 1);
      
      // Construct final URL with correct database name
      mongoURL = queryParams ? `${urlWithoutDb}${dbName}?${queryParams}` : `${urlWithoutDb}${dbName}`;
    } else {
      mongoURL = `${mongoURL}/${dbName}`;
    }
    
    await mongoose.connect(mongoURL);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', dbName);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
