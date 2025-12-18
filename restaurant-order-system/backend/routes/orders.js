const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, notes, tableNumber } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    let totalAmount = 0;
    let estimatedTime = 0;
    
    // Calculate total and estimated time
    for (let item of items) {
      if (!item.menuItem || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item data' });
      }
      
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      
      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }
      
      totalAmount += menuItem.price * item.quantity;
      estimatedTime = Math.max(estimatedTime, menuItem.preparationTime);
    }
    
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      estimatedTime,
      notes,
      tableNumber: tableNumber || `T${Math.floor(Math.random() * 50) + 1}`
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
    const validStatuses = ['placed', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
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

// Cancel order (user)
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'placed') {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }
    
    order.status = 'cancelled';
    await order.save();
    await order.populate('items.menuItem user');
    
    const io = req.app.get('io');
    io.emit('order-status-update', { orderId: order._id, status: 'cancelled', orderNumber: order.orderNumber });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order analytics (admin only)
router.get('/analytics/stats', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const orders = await Order.find(query);
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const activeOrders = orders.filter(o => ['placed', 'preparing', 'ready'].includes(o.status)).length;
    
    // Revenue by status
    const revenueByStatus = {
      completed: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0),
      cancelled: orders.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0),
      pending: orders.filter(o => ['placed', 'preparing', 'ready'].includes(o.status)).reduce((sum, o) => sum + o.totalAmount, 0)
    };
    
    // Popular items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemId = item.menuItem.toString();
        itemCounts[itemId] = (itemCounts[itemId] || 0) + item.quantity;
      });
    });
    
    res.json({
      totalOrders,
      totalRevenue,
      completedOrders,
      cancelledOrders,
      activeOrders,
      revenueByStatus,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;