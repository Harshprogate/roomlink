const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { city, minBudget, maxBudget, gender, sort } = req.query;
    const query = {};
    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (gender) query.gender = gender;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }
    let sortQuery = { createdAt: -1 };
    if (sort === 'budget_low') sortQuery = { budget: 1 };
    else if (sort === 'budget_high') sortQuery = { budget: -1 };
    else if (sort === 'age_low') sortQuery = { age: 1 };
    else if (sort === 'age_high') sortQuery = { age: -1 };

    const profiles = await Profile.find(query).sort(sortQuery).lean();
    res.render('index', { profiles, filters: { city: city || '', gender: gender || '', minBudget: minBudget || '', maxBudget: maxBudget || '', sort: sort || 'recent' } });
  } catch (e) {
    res.status(500).send('Failed to load');
  }
});

router.get('/profiles/new', (req, res) => {
  res.render('create');
});

router.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).lean();
    if (!profile) return res.status(404).send('Not found');
    res.render('show', { profile });
  } catch (e) {
    res.status(400).send('Invalid request');
  }
});

router.post('/profiles', upload.single('photo'), async (req, res) => {
  try {
    const { name, age, gender, city, budget, preferences, bio } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const prefArr = preferences ? preferences.split(',').map(p => p.trim()).filter(Boolean) : [];
    const created = await Profile.create({
      name,
      age,
      gender,
      city,
      budget,
      preferences: prefArr,
      bio,
      photoUrl,
    });
    res.redirect(`/profiles/${created._id}`);
  } catch (e) {
    res.status(400).send('Failed to create');
  }
});

module.exports = router;
