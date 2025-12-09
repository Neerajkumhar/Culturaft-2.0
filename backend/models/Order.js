const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
  sgstRate: { type: Number, default: 0 }, // percentage
  cgstRate: { type: Number, default: 0 }, // percentage
  sgstAmount: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
}, { _id: false });

const ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
}, { _id: false });

const PaymentDetailsSchema = new mongoose.Schema({
  method: { type: String, enum: ['card', 'paypal'], required: true },
  cardNumber: { type: String }, // Last 4 digits only (for security)
  expiry: { type: String },
  cvc: { type: String },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  shippingAddress: { type: ShippingAddressSchema, required: true },
  paymentDetails: { type: PaymentDetailsSchema, required: true },
  status: { type: String, enum: ['pending','accepted','shipped','delivered'], default: 'pending' },
  total: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  sgstTotal: { type: Number, default: 0 },
  cgstTotal: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
