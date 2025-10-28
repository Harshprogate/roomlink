exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
};

exports.requireOwner = (getOwnerId) => async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) return res.redirect('/login');
    const ownerId = await getOwnerId(req);
    if (ownerId && ownerId.toString() === req.session.user._id) return next();
    return res.status(403).send('Forbidden');
  } catch (e) {
    return res.status(400).send('Invalid request');
  }
};
