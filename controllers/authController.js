const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = '3sIueX5FbB9B1G4vX9+OwI7zFt/P9FPW3sLd0R9MxHQ=';

exports.register = async (req, res) => {
  const { username, email, password, phone, role, balance } = req.body;
  console.log(username + email + password + phone + role + balance );
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
      const user = await User.findOne({ email});
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
  



