const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { readJSON, writeJSON } = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Get pending payments (admin)
router.get('/pending', (req, res) => {
  const payments = readJSON('payments.json');
  const debts = readJSON('debts.json');
  const borrowers = readJSON('borrowers.json');
  const installments = readJSON('installments.json');

  const adminDebts = debts.filter(d => d.adminId === req.user.id);
  const adminDebtIds = adminDebts.map(d => d.id);

  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .filter(p => {
      const inst = installments.find(i => i.id === p.installmentId);
      return inst && adminDebtIds.includes(inst.debtId);
    })
    .map(p => {
      const inst = installments.find(i => i.id === p.installmentId);
      const debt = debts.find(d => d.id === inst?.debtId);
      const borrower = borrowers.find(b => b.id === debt?.borrowerId);
      return {
        ...p,
        borrowerName: borrower?.name || 'Unknown',
        amount: inst?.amount || 0,
        debtTotal: debt?.totalAmount || 0,
        dueDate: inst?.dueDate || ''
      };
    });

  res.json(pendingPayments);
});

// Upload payment proof (borrower)
router.post('/upload', upload.single('proof'), (req, res) => {
  const { installmentId } = req.body;
  if (!installmentId || !req.file) {
    return res.status(400).json({ error: 'Installment ID dan bukti diperlukan' });
  }

  const payments = readJSON('payments.json');
  const payment = {
    id: uuidv4(),
    installmentId,
    userId: req.user.id,
    proofUrl: `/uploads/${req.file.filename}`,
    status: 'pending',
    adminNote: '',
    submittedAt: new Date().toISOString(),
    reviewedAt: null
  };

  payments.push(payment);
  writeJSON('payments.json', payments);
  res.json(payment);
});

// Approve payment
router.post('/:id/approve', (req, res) => {
  const payments = readJSON('payments.json');
  const installments = readJSON('installments.json');

  const payment = payments.find(p => p.id === req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  payment.status = 'approved';
  payment.reviewedAt = new Date().toISOString();
  payment.adminNote = req.body.note || '';

  // Mark installment as paid
  const inst = installments.find(i => i.id === payment.installmentId);
  if (inst) {
    inst.status = 'paid';
    inst.paidAt = new Date().toISOString();
  }

  writeJSON('payments.json', payments);
  writeJSON('installments.json', installments);

  // Check if all installments paid -> mark debt as completed
  if (inst) {
    const debts = readJSON('debts.json');
    const debtInstallments = installments.filter(i => i.debtId === inst.debtId);
    const allPaid = debtInstallments.every(i => i.status === 'paid');
    if (allPaid) {
      const debt = debts.find(d => d.id === inst.debtId);
      if (debt) {
        debt.status = 'completed';
        writeJSON('debts.json', debts);
      }
    }
  }

  res.json(payment);
});

// Reject payment
router.post('/:id/reject', (req, res) => {
  const payments = readJSON('payments.json');
  const payment = payments.find(p => p.id === req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  payment.status = 'rejected';
  payment.reviewedAt = new Date().toISOString();
  payment.adminNote = req.body.note || '';

  writeJSON('payments.json', payments);
  res.json(payment);
});

module.exports = router;
