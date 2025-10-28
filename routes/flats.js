const express = require('express');
const Flat = require('../models/Flat');
const upload = require('../middleware/upload');
const { requireAuth, requireOwner } = require('../middleware/auth');

const router = express.Router();

// List my flats
router.get('/', requireAuth, async (req, res) => {
  const flats = await Flat.find({ owner: req.session.user._id }).sort({ createdAt: -1 }).lean();
  res.render('flats/index', { flats });
});

// New flat form
router.get('/new', requireAuth, (req, res) => {
  res.render('flats/new');
});

// Create flat
router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  const { title, city, address, rent, rooms, amenities, description, contactPhone } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const amen = amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
  const flat = await Flat.create({
    owner: req.session.user._id,
    title,
    city,
    address,
    rent,
    rooms,
    amenities: amen,
    description,
    contactPhone,
    photoUrl,
  });
  res.redirect(`/flats/${flat._id}`);
});

// Show flat
router.get('/:id', async (req, res) => {
  const flat = await Flat.findById(req.params.id).populate('owner').lean();
  if (!flat) return res.status(404).send('Not found');
  const isOwner = req.session.user && req.session.user._id === flat.owner._id.toString();
  res.render('flats/show', { flat, isOwner });
});

// Edit form (owner only)
router.get('/:id/edit', requireAuth, requireOwner(async (req) => {
  const f = await Flat.findById(req.params.id);
  return f?.owner;
}), async (req, res) => {
  const flat = await Flat.findById(req.params.id).lean();
  if (!flat) return res.status(404).send('Not found');
  res.render('flats/edit', { flat });
});

// Update (owner only)
router.put('/:id', requireAuth, requireOwner(async (req) => {
  const f = await Flat.findById(req.params.id);
  return f?.owner;
}), upload.single('photo'), async (req, res) => {
  const { title, city, address, rent, rooms, amenities, description, contactPhone } = req.body;
  const updates = { title, city, address, rent, rooms, description, contactPhone };
  if (amenities) updates.amenities = amenities.split(',').map(a => a.trim()).filter(Boolean);
  if (req.file) updates.photoUrl = `/uploads/${req.file.filename}`;
  await Flat.findByIdAndUpdate(req.params.id, updates);
  res.redirect(`/flats/${req.params.id}`);
});

// Delete (owner only)
router.delete('/:id', requireAuth, requireOwner(async (req) => {
  const f = await Flat.findById(req.params.id);
  return f?.owner;
}), async (req, res) => {
  await Flat.findByIdAndDelete(req.params.id);
  res.redirect('/flats');
});

module.exports = router;
