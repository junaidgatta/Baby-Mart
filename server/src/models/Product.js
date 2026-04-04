const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    category:    {
      type: String,
      required: true,
    },
    images:      [{ type: String }],
    stock:       { type: Number, required: true, default: 0, min: 0 },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured:  { type: Boolean, default: false },
    tags:        [{ type: String }],
    ageRange:    { type: String, default: '0-12 months' },
  },
  { timestamps: true }
);

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
