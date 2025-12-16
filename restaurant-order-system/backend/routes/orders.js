const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, notes } = req.body;
    let totalAmount = 0;
    let estimatedTime = 0;
    
    // Calculate total and estimated time
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      totalAmount += menuItem.price * item.quantity;
      estimatedTime = Math.max(estimatedTime, menuItem.preparationTime);
    }
    
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      estimatedTime,
      notes
    });
    
    await order.save();
    await order.populate('items.menuItem user');
    
    // Emit to admin dashboard
    const io = req.app.get('io');
    io.to('admin').emit('new-order', order);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const orders = await Order.find()
      .populate('items.menuItem user')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem user');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Emit status update to all clients
    const io = req.app.get('io');
    io.emit('order-status-update', { orderId: order._id, status, orderNumber: order.orderNumber });
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;