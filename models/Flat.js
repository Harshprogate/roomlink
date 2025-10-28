const mongoose = require('mongoose');

const FlatSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    rent: { type: Number, required: true },
    rooms: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    description: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flat', FlatSchema);
