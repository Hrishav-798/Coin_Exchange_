const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coin_exchange';

async function seedUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const username = 'saptarshi';
    const password = '2005';

    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      console.log(`User ${username} not found. Creating...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({ username, password: hashedPassword });
      await user.save();
      console.log(`✅ User ${username} created successfully with password ${password}`);
    } else {
      console.log(`✅ User ${username} already exists`);
      // Update password just in case it's wrong in DB
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log(`✅ User ${username} password reset to ${password}`);
    }
  } catch (error) {
    console.error('❌ Error seeding user:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedUser();
