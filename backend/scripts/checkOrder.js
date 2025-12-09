const mongoose = require('mongoose');
const Order = require('../models/Order');

async function checkOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/culturaft');
    
    const order = await Order.findById('6936b4b188463e9a099aaa72');
    
    if (!order) {
      console.log('❌ Order not found');
      process.exit(0);
    }
    
    console.log('Order found:');
    console.log('  ID:', order._id);
    console.log('  User:', order.user);
    console.log('  Has shippingAddress:', !!order.shippingAddress);
    console.log('  Has paymentDetails:', !!order.paymentDetails);
    console.log('  Has createdAt:', !!order.createdAt);
    console.log('  createdAt type:', typeof order.createdAt);
    console.log('  Status:', order.status);
    console.log('  Total:', order.total);
    
    if (order.shippingAddress) {
      console.log('  shippingAddress:', JSON.stringify(order.shippingAddress));
    }
    
    if (order.paymentDetails) {
      console.log('  paymentDetails:', JSON.stringify(order.paymentDetails));
    }
    
    console.log('  items count:', order.items?.length || 0);
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

checkOrders();
