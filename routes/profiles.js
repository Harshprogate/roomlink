const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createProfile, listProfiles, getProfileById } = require('../controllers/profiles');

router.get('/', listProfiles);
router.get('/:id', getProfileById);
router.post('/', upload.single('photo'), createProfile);

module.exports = router;
