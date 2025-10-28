const express = require('express');
const router = express.Router();

// Placeholder routes for users (extend later with auth)
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
