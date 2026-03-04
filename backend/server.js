const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Middleware
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json()); // Parse incoming JSON payloads

// Serve static assets (CSS, JS, images) from the new src directory
app.use(express.static(path.join(__dirname, '../frontend/src')));

// Serve the HTML pages explicitly since they are in a subfolder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/signup.html'));
});

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coin_exchange';

const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully');
    
    try {
      // Seed default user
      const username = 'saptarshi';
      const password = '2005';
      let user = await User.findOne({ username });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, password: hashedPassword });
        await user.save();
        console.log(`✅ Default demo user '${username}' seeded automatically.`);
      }
    } catch (seedErr) {
      console.error('❌ Failed to seed default user:', seedErr);
    }
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.warn('⚠️ Server will still run, but login/signup will be unavailable until the database connects.');
  });

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
