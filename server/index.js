const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const debtRoutes = require('./routes/debts');
const borrowerRoutes = require('./routes/borrowers');
const paymentRoutes = require('./routes/payments');
const settingsRoutes = require('./routes/settings');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/debts', authMiddleware, debtRoutes);
app.use('/api/borrowers', authMiddleware, borrowerRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hutakmu server running on port ${PORT}`);
});
