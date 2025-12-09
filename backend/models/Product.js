const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  description: { type: String },
  origin: { type: String },
  artisanStory: { type: String },
  materialsCare: { type: String },
  shippingReturns: { type: String },
  sgst: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
