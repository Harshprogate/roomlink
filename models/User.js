const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
