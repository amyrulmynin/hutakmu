const express = require('express');
const { readJSON, writeJSON } = require('../db');

const router = express.Router();

// Get settings for current admin
router.get('/', (req, res) => {
  const settings = readJSON('settings.json');
  const mySetting = settings.find(s => s.adminId === req.user.id);
  res.json(mySetting || { adminId: req.user.id, paymentInfo: {}, smsConfig: {} });
});

// Update settings
router.post('/', (req, res) => {
  const settings = readJSON('settings.json');
  const idx = settings.findIndex(s => s.adminId === req.user.id);

  const setting = {
    adminId: req.user.id,
    paymentInfo: req.body.paymentInfo || {},
    smsConfig: req.body.smsConfig || {},
    updatedAt: new Date().toISOString()
  };

  if (idx >= 0) {
    settings[idx] = setting;
  } else {
    settings.push(setting);
  }

  writeJSON('settings.json', settings);
  res.json(setting);
});

// Get dashboard stats
router.get('/stats', (req, res) => {
  const debts = readJSON('debts.json');
  const payments = readJSON('payments.json');
  const installments = readJSON('installments.json');
  const borrowers = readJSON('borrowers.json');

  const myDebts = debts.filter(d => d.adminId === req.user.id);
  const myBorrowers = borrowers.filter(b => b.adminId === req.user.id);
  const activeDebts = myDebts.filter(d => d.status === 'active');
  const totalOwed = activeDebts.reduce((sum, d) => sum + d.totalAmount, 0);

  const myDebtIds = myDebts.map(d => d.id);
  const myInstallments = installments.filter(i => myDebtIds.includes(i.debtId));
  const paidInstallments = myInstallments.filter(i => i.status === 'paid');
  const totalCollected = paidInstallments.reduce((sum, i) => sum + i.amount, 0);

  const pendingPayments = payments.filter(p => {
    if (p.status !== 'pending') return false;
    const inst = installments.find(i => i.id === p.installmentId);
    return inst && myDebtIds.includes(inst.debtId);
  });

  res.json({
    totalOwed: Math.round(totalOwed * 100) / 100,
    totalCollected: Math.round(totalCollected * 100) / 100,
    activeDebts: activeDebts.length,
    totalBorrowers: myBorrowers.length,
    pendingApprovals: pendingPayments.length
  });
});

module.exports = router;
