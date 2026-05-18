const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { readJSON, writeJSON } = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `proof-${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Public: Get debt payment info (no auth needed)
router.get('/:debtId', (req, res) => {
  const debts = readJSON('debts.json');
  const installments = readJSON('installments.json');
  const borrowers = readJSON('borrowers.json');
  const settings = readJSON('settings.json');
  const users = readJSON('users.json');

  const debt = debts.find(d => d.id === req.params.debtId);
  if (!debt) return res.status(404).json({ error: 'Hutang tidak dijumpai' });

  const borrower = borrowers.find(b => b.id === debt.borrowerId);
  const admin = users.find(u => u.id === debt.adminId);
  const adminSettings = settings.find(s => s.adminId === debt.adminId);
  const debtInstallments = installments.filter(i => i.debtId === debt.id);

  // Find next unpaid installment
  const nextInstallment = debtInstallments.find(i => i.status === 'pending');
  const paidCount = debtInstallments.filter(i => i.status === 'paid').length;

  res.json({
    debt: {
      id: debt.id,
      totalAmount: debt.totalAmount,
      monthlyPayment: debt.monthlyPayment,
      durationMonths: debt.durationMonths,
      status: debt.status,
      paidCount,
    },
    borrower: {
      name: borrower?.name || 'Unknown',
    },
    admin: {
      name: admin?.name || 'Unknown',
    },
    paymentInfo: adminSettings?.paymentInfo || {},
    nextInstallment: nextInstallment || null,
    installments: debtInstallments,
  });
});

// Public: Upload payment proof (no auth, uses debtId)
router.post('/:debtId/pay', upload.single('proof'), (req, res) => {
  const { installmentId } = req.body;
  if (!installmentId || !req.file) {
    return res.status(400).json({ error: 'Installment ID dan bukti diperlukan' });
  }

  const installments = readJSON('installments.json');
  const inst = installments.find(i => i.id === installmentId);
  if (!inst) return res.status(404).json({ error: 'Installment tidak dijumpai' });

  const payments = readJSON('payments.json');

  // Check if already submitted
  const existing = payments.find(p => p.installmentId === installmentId && p.status === 'pending');
  if (existing) return res.status(400).json({ error: 'Bukti sudah dihantar, tunggu admin approve' });

  const payment = {
    id: uuidv4(),
    installmentId,
    debtId: req.params.debtId,
    proofUrl: `/uploads/${req.file.filename}`,
    status: 'pending',
    adminNote: '',
    submittedAt: new Date().toISOString(),
    reviewedAt: null
  };

  payments.push(payment);
  writeJSON('payments.json', payments);
  res.json({ success: true, message: 'Bukti bayaran dihantar. Tunggu admin approve.' });
});

module.exports = router;
