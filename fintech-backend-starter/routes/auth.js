
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;

const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/seed", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("test123", 10);
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });
    await user.save();
    res.json({ msg: "Test user created!" });
  } catch (err) {
    res.status(500).json({ msg: "Error seeding user", error: err.message });
  }
});
