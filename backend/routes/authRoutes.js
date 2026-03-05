const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'Identity created successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Fallback for demo user if database is disconnected
    if (mongoose.connection.readyState !== 1) {
      if (username === 'saptarshi' && password === '2005') {
        const payload = { user: { id: 'demo_offline_mode', username: 'saptarshi' } };
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_keep_it_safe_in_prod';
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
        return res.json({ success: true, token, username: 'saptarshi', message: 'Authorization successful (Offline Demo Mode)' });
      } else {
        return res.status(400).json({ success: false, message: 'Database offline. Only default demo user is available.' });
      }
    }

    // Check if user exists (when DB is online)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username
      },
    };

    // Sign a token
    // In production, use a strong secret from environment variables
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_keep_it_safe_in_prod';
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '2h' }, // Token expires in 2 hours
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token, username: user.username, message: 'Authorization successful' });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;
