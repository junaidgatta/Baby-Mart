const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  image:    { type: String, default: '' },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zip:      { type: String, required: true },
  country:  { type: String, default: 'Pakistan' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => `BM-${nanoid()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items:           [orderItemSchema],
    totalAmount:     { type: Number, required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod:   { type: String, enum: ['cod'], default: 'cod' },

    // COD flow: pending → confirmed → delivered
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },

    notes:    { type: String, default: '' },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Validate COD status transitions
orderSchema.methods.canTransitionTo = function (newStatus) {
  const transitions = {
    pending:   ['confirmed', 'cancelled'],
    confirmed: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
  };
  return transitions[this.status]?.includes(newStatus) ?? false;
};

module.exports = mongoose.model('Order', orderSchema);
