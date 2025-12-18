const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.user._id });
    await transaction.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('transaction-added', transaction);
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('transaction-deleted', { id: req.params.id });
    
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const transactions = await Transaction.find(query);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    const categoryData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    // Monthly data for charts
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === 'income') monthlyData[month].income += t.amount;
      else monthlyData[month].expenses += t.amount;
    });
    
    const monthlyArray = Object.values(monthlyData).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    ).slice(-6);
    
    res.json({ 
      totalIncome, 
      totalExpenses, 
      balance: totalIncome - totalExpenses, 
      categoryData,
      monthlyData: monthlyArray
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const query = { user: req.user._id };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;