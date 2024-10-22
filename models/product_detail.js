const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  specifications: {
    type: Map, // Using Map for flexible key-value pairs (e.g., key: "Battery Life", value: "10 hours")
    of: String,
    required: true,
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['cm', 'inch'], // Can be either cm or inch
      required: true,
    },
  },
  weight: {
    type: Number,
    required: true,
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'lb'], // Can be either kg or lb
    required: true,
  },
  material: {
    type: String,
    trim: true,
  },
  manufacturer: {
    name: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    warrantyPeriod: {
      type: String, // e.g., "2 years", "6 months"
      trim: true,
    },
  },
  additionalInformation: {
    type: String, // For any extra information like instructions, warnings, etc.
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the ProductDetail model
const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

module.exports = ProductDetail;
