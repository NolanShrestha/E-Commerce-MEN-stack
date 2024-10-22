const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', 
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'wallet', 'cash_on_delivery'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount must be greater than or equal to 0'],
  },
  currency: {
    type: String,
    default: 'USD', 
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD'], 
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending', 
  },
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now, 
  },
  refundReason: {
    type: String,
    default: null,
  },
  refundDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); 

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
