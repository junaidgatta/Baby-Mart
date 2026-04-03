const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

// Client — create order on checkout (COD)
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'cod' } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items in order' });
    if (!shippingAddress)
      return res.status(400).json({ success: false, message: 'Shipping address required' });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const orderData = {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    };

    // If logged in, attach user
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
       // Manual check since we removed middleware
       try {
         const jwt = require('jsonwebtoken');
         const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
         orderData.user = decoded.id;
       } catch (e) {
         orderData.isGuest = true;
       }
    } else {
      orderData.isGuest = true;
    }

    const order = await Order.create(orderData);

    // 📉 Decrement product stock
    try {
      const Product = require('../models/Product');
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty }
        });
      }
    } catch (stockErr) {
      console.error('Stock decrement error:', stockErr);
      // We don't block the order if stock update fails, but we log it
    }

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
// Client — single order detail (now public for success page)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name images slug'
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Allow view if:
    // 1. Order is guest order (needed for success page)
    // 2. OR User is logged in and is the owner
    // 3. OR User is an admin
    if (order.isGuest) {
       return res.json({ success: true, order });
    }

    // Manual auth check for non-guest orders
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (order.user.toString() === decoded.id || decoded.role === 'admin') {
           return res.json({ success: true, order });
        }
      } catch (e) {}
    }

    res.status(403).json({ success: false, message: 'Not authorized to view this order' });
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
