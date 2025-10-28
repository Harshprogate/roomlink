const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/chat', requireAuth, (req, res) => {
  res.render('chat/index');
});

module.exports = router;
