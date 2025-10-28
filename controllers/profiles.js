const Profile = require('../models/Profile');

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { name, age, gender, city, budget, preferences, bio } = req.body;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const profile = await Profile.create({
      name,
      age,
      gender,
      city,
      budget,
      preferences: preferences ? [].concat(preferences) : [],
      bio,
      photoUrl,
    });

    return res.status(201).json(profile);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create profile', error: err.message });
  }
};

// List all profiles with optional filters
exports.listProfiles = async (req, res) => {
  try {
    const { city, minBudget, maxBudget, gender } = req.query;
    const query = {};

    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (gender) query.gender = gender;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    return res.json(profiles);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profiles', error: err.message });
  }
};

// Get a single profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    return res.json(profile);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
