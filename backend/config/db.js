const mongoose = require('mongoose');

let isConnected = false; // Track the connection state

const connectDB = async (uri) => {
  if (isConnected) {
    // Reuse the existing connection
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    throw err;
  }
};

module.exports = connectDB;
