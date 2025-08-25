// This file handles the connection to our MongoDB database using Mongoose.

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB cluster.
    // The connection string is retrieved from our environment variables.
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    // If the connection fails, log the error and exit the process.
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;