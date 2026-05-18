const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field diperlukan' });
    }

    const users = readJSON('users.json');
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email sudah didaftarkan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    writeJSON('users.json', users);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password diperlukan' });
    }

    const users = readJSON('users.json');
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
