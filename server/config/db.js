const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic and event listeners.
 * Uses MONGO_URI from environment variables.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    console.log("URI =", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
}
};

module.exports = connectDB;
