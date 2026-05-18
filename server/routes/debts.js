const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../db');

const router = express.Router();

// Get all debts for current admin
router.get('/', (req, res) => {
  const debts = readJSON('debts.json');
  const installments = readJSON('installments.json');
  const borrowers = readJSON('borrowers.json');

  const myDebts = debts.filter(d => d.adminId === req.user.id).map(debt => {
    const borrower = borrowers.find(b => b.id === debt.borrowerId);
    const debtInstallments = installments.filter(i => i.debtId === debt.id);
    const paidCount = debtInstallments.filter(i => i.status === 'paid').length;
    return {
      ...debt,
      borrowerName: borrower?.name || 'Unknown',
      borrowerPhone: borrower?.phone || '',
      paidCount,
      installments: debtInstallments
    };
  });

  res.json(myDebts);
});

// Get debts for borrower (my-debts view)
router.get('/my', (req, res) => {
  const debts = readJSON('debts.json');
  const installments = readJSON('installments.json');
  const users = readJSON('users.json');

  const myDebts = debts.filter(d => d.borrowerUserId === req.user.id).map(debt => {
    const admin = users.find(u => u.id === debt.adminId);
    const debtInstallments = installments.filter(i => i.debtId === debt.id);
    const paidCount = debtInstallments.filter(i => i.status === 'paid').length;
    return {
      ...debt,
      adminName: admin?.name || 'Unknown',
      paidCount,
      installments: debtInstallments
    };
  });

  res.json(myDebts);
});

// Create debt
router.post('/', (req, res) => {
  const { borrowerId, amount, flatFee, durationMonths, startDate } = req.body;
  if (!borrowerId || !amount || !durationMonths) {
    return res.status(400).json({ error: 'Maklumat tidak lengkap' });
  }

  const totalAmount = parseFloat(amount) + parseFloat(flatFee || 0);
  const monthlyPayment = totalAmount / parseInt(durationMonths);

  const debt = {
    id: uuidv4(),
    adminId: req.user.id,
    borrowerId,
    amount: parseFloat(amount),
    flatFee: parseFloat(flatFee || 0),
    totalAmount,
    durationMonths: parseInt(durationMonths),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    startDate: startDate || new Date().toISOString().split('T')[0],
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const debts = readJSON('debts.json');
  debts.push(debt);
  writeJSON('debts.json', debts);

  // Generate installments
  const installments = readJSON('installments.json');
  const start = new Date(debt.startDate);

  for (let i = 0; i < debt.durationMonths; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    installments.push({
      id: uuidv4(),
      debtId: debt.id,
      month: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: debt.monthlyPayment,
      status: 'pending',
      paidAt: null
    });
  }

  writeJSON('installments.json', installments);
  res.json(debt);
});

// Get single debt with installments
router.get('/:id', (req, res) => {
  const debts = readJSON('debts.json');
  const installments = readJSON('installments.json');
  const borrowers = readJSON('borrowers.json');

  const debt = debts.find(d => d.id === req.params.id);
  if (!debt) return res.status(404).json({ error: 'Hutang tidak dijumpai' });

  const borrower = borrowers.find(b => b.id === debt.borrowerId);
  const debtInstallments = installments.filter(i => i.debtId === debt.id);

  res.json({
    ...debt,
    borrowerName: borrower?.name || 'Unknown',
    installments: debtInstallments
  });
});

module.exports = router;
