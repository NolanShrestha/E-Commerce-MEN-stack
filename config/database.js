const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Task4_db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); 
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error; 
  }
};

module.exports = connectDB;
