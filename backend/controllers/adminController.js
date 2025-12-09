const Order = require('../models/Order');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json(notes);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
  res.json(orders);
};
