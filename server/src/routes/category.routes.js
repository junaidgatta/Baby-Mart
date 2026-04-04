const express = require('express');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

// GET all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new category (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, icon, desc } = req.body;
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }
    const category = await Category.create({ name, slug, icon, desc });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update category (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, icon, desc } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, icon, desc },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE category (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    await category.deleteOne();
    res.json({ success: true, message: 'Category removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
