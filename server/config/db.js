const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV lookup issue with mongodb+srv://
dns.setDefaultResultOrder('ipv4first');

let isConnected = false;

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection... (attempt ${retries + 1}/${maxRetries})`);
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed: ${error.message}`);
      
      if (retries < maxRetries) {
        const waitTime = retries * 3000;
        console.log(`   Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`\n⚠️  Could not connect to MongoDB after ${maxRetries} attempts.`);
        console.error(`   The server will continue running WITHOUT database access.`);
        console.error(`   API calls that require the database will return errors.\n`);
        console.error(`   To fix:`);
        console.error(`   1. Go to MongoDB Atlas → Network Access → Add your current IP`);
        console.error(`   2. Or click "Allow Access From Anywhere" (0.0.0.0/0)`);
        console.error(`   3. Then restart the server\n`);
        // DON'T exit — let the server keep running
      }
    }
  }
};

const getConnectionStatus = () => isConnected;

module.exports = { connectDB, getConnectionStatus };
