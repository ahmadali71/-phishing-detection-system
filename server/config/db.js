const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV lookup issue with mongodb+srv://
// Forces IPv4 first, which resolves ECONNREFUSED on many Windows machines
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection... (attempt ${retries + 1}/${maxRetries})`);
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return; // Success, exit the function
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed: ${error.message}`);
      
      if (retries < maxRetries) {
        const waitTime = retries * 3000; // Increasing delay: 3s, 6s, 9s, 12s
        console.log(`   Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`\n❌ Could not connect to MongoDB after ${maxRetries} attempts.`);
        console.error(`   Possible fixes:`);
        console.error(`   1. Go to MongoDB Atlas → Network Access → Add your current IP address`);
        console.error(`   2. Check your internet connection`);
        console.error(`   3. Verify the MONGO_URI in your .env file is correct`);
        console.error(`   4. Make sure your MongoDB Atlas cluster is running\n`);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
