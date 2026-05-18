const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../db');

const router = express.Router();

// Get all borrowers for current admin
router.get('/', (req, res) => {
  const borrowers = readJSON('borrowers.json');
  const myBorrowers = borrowers.filter(b => b.adminId === req.user.id);
  res.json(myBorrowers);
});

// Create borrower
router.post('/', (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Nama dan telefon diperlukan' });
  }

  const borrowers = readJSON('borrowers.json');
  const borrower = {
    id: uuidv4(),
    adminId: req.user.id,
    name,
    phone,
    email: email || '',
    createdAt: new Date().toISOString()
  };

  borrowers.push(borrower);
  writeJSON('borrowers.json', borrowers);
  res.json(borrower);
});

// Delete borrower
router.delete('/:id', (req, res) => {
  let borrowers = readJSON('borrowers.json');
  borrowers = borrowers.filter(b => !(b.id === req.params.id && b.adminId === req.user.id));
  writeJSON('borrowers.json', borrowers);
  res.json({ success: true });
});

module.exports = router;
