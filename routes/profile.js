const express = require('express');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();
  res.render('profile/show', { user });
});

router.get('/profile/edit', requireAuth, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();
  res.render('profile/edit', { user });
});

router.post('/profile', requireAuth, upload.single('avatar'), async (req, res) => {
  const { name, phone } = req.body;
  const updates = { name, phone };
  if (req.file) updates.avatarUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.session.user._id, updates, { new: true });
  req.session.user = { _id: user._id.toString(), name: user.name, email: user.email, avatarUrl: user.avatarUrl };
  res.redirect('/profile');
});

module.exports = router;
