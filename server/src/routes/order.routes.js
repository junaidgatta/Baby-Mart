const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Client — create order on checkout (COD)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'cod' } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items in order' });
    if (!shippingAddress)
      return res.status(400).json({ success: false, message: 'Shipping address required' });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders/my ───────────────────────────────────────────────────────
// Client — current user's order history
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images slug');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
// Client — single order detail
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name images slug'
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Only owner or admin can view
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders (Admin) ─────────────────────────────────────────────────
// Admin — list all orders with filters
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);

    // Stats
    const stats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    ]);

    res.json({ success: true, orders, total, page: Number(page), stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/orders/:id/status (Admin) ────────────────────────────────────
// Admin — update order status with transition validation
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!order.canTransitionTo(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from "${order.status}" to "${status}"`,
      });
    }

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
