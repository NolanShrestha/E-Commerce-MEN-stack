const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');
const Payment = require('../models/payment');
const Review = require('../models/review');

const JWT_SECRET = '3sIueX5FbB9B1G4vX9+OwI7zFt/P9FPW3sLd0R9MxHQ=';

exports.register = async (req, res) => {
  const { username, email, password, phone, role, balance } = req.body;
  console.log(username + email + password + phone + role + balance);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      balance,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {

    console.error('Registration error:', error);
    res.status(400).json({ error: 'User registration failed!' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({ message: 'Login Successful!' });
  } catch (error) {
    res.status(400).json({ error: 'Login failed!' });
  }
};

exports.update = async (req, res) => {
  const { email, currentPassword, newUsername, newPassword, newPhone } = req.body;

  console.log('Incoming request:', { email, currentPassword, newUsername, newPassword, newPhone });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid current password!' });
    }

    if (newUsername) {
      user.username = newUsername;
      console.log('Username updated:', newUsername);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      console.log('Password updated:', newPassword);
    }

    if (newPhone) {
      user.phone = newPhone;
      console.log('Phone updated:', newPhone);
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'User information updated successfully!',
      token,
      userId: user._id,
      updatedUser: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user information!' });
  }
};

exports.addProduct = async (req, res) => {
  const { email, name, description, price, stock } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: 'Access denied!' });
    }
    const product = new Product({
      name,
      description,
      price,
      stock
    });

    await product.save();

    res.status(201).json({ message: 'Product added successfully!', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product!', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { email, productName } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: 'Access denied!' });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    await Product.deleteOne({ _id: product._id });

    res.status(200).json({ message: 'Product deleted successfully!', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product!', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { email, productName, quantity } = req.body;

  try {
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found!' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock!' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.productName === productName);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productName, quantity });
    }

    await user.save();

    res.status(200).json({
      message: 'Product added to cart successfully!',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add product to cart!' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { email, productName, quantity } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.productName === productName);

    if (cartItemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart!' });
    }

    if (quantity >= user.cart[cartItemIndex].quantity) {
      user.cart.splice(cartItemIndex, 1);
    } else {
      user.cart[cartItemIndex].quantity -= quantity;
    }

    await user.save();

    res.status(200).json({
      message: 'Product removed from cart successfully!',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove product from cart!' });
  }
};

exports.payment = async (req, res) => {
  const { email, productName } = req.body;
  try {
    const user = await User.findOne({ email }).populate('cart.productName');
    const product = await Product.findOne({ name: productName });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    let totalCost = 0;
    const cartProducts = [];

    for (const cartItem of user.cart) {
      const product = await Product.findOne({ name: cartItem.productName });
      if (!product) {
        return res.status(400).json({ error: `Product ${cartItem.productName} not found in stock!` });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${cartItem.productName}!` });
      }

      totalCost += product.price * cartItem.quantity;
      cartProducts.push({ product, quantity: cartItem.quantity });
    }

    if (user.balance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance!' });
    }

    user.balance -= totalCost;

    for (const item of cartProducts) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const newPayment = new Payment({
      userId: user._id,
      productId: product._id,
      amount: totalCost,
      productDetails: cartProducts.map(item => ({
        quantity: item.quantity,
        price: item.product.price,
      })),
    });
    await newPayment.save();

    user.cart = [];
    await user.save();

    res.status(200).json({
      message: 'Payment successful!',
      totalCost,
      updatedBalance: user.balance,
      paymentDetails: newPayment,
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed!' });
  }
};

exports.review = async (req, res) => {
  const { productName, email, rating, reviewText } = req.body;
  try {
    const user = await User.findOne({ email });
    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ error: 'Product not found!' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const review = new Review({
      productId: product._id,
      userId: user._id,
      rating,
      reviewText
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully!',
      review: {
        productId: review.productId,
        userId: review.userId,
        rating: review.rating,
        reviewText: review.reviewText
      }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review!' });
  }
};






