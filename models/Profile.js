const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 16, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    city: { type: String, required: true },
    budget: { type: Number, required: true },
    preferences: { type: [String], default: [] },
    bio: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
