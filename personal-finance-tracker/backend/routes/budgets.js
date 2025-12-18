const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    const query = { user: req.user._id };
    if (month) query.month = month;
    
    const budgets = await Budget.find(query);
    
    // Calculate spent for each budget
    for (let budget of budgets) {
      const startDate = new Date(budget.month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      const transactions = await Transaction.find({
        user: req.user._id,
        category: budget.category,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      });
      
      budget.spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      await budget.save();
    }
    
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const budget = new Budget({ ...req.body, user: req.user._id });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
