const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send('Missing fields');
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    req.session.user = { _id: user._id.toString(), name: user.name, email: user.email };
    res.redirect('/');
  } catch (e) {
    res.status(400).send('Registration failed');
  }
});

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).send('Invalid credentials');
    req.session.user = { _id: user._id.toString(), name: user.name, email: user.email };
    res.redirect('/');
  } catch (e) {
    res.status(400).send('Login failed');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
