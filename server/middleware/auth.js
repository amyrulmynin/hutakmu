const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hutakmu-secret-key-2026';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
