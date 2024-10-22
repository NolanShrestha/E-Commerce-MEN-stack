const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewText: {
    type: String,
    trim: true,
    required: true,
    maxlength: 500, // Maximum length for the review text
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
