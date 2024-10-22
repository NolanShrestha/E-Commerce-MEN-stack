const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
