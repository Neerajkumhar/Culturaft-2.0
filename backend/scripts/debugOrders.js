const mongoose = require('mongoose');
const Order = require('../models/Order');

async function debugOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/culturaft');
    
    const orders = await Order.find().limit(3);
    console.log('Total orders:', orders.length);
    
    orders.forEach((order, i) => {
      console.log(`\nOrder ${i+1}:`);
      console.log('  ID:', order._id);
      console.log('  User:', order.user);
      console.log('  Has shippingAddress:', !!order.shippingAddress);
      console.log('  Has paymentDetails:', !!order.paymentDetails);
      console.log('  Items count:', order.items?.length || 0);
      if (order.shippingAddress) {
        console.log('  shippingAddress:', JSON.stringify(order.shippingAddress));
      }
      if (order.paymentDetails) {
        console.log('  paymentDetails:', JSON.stringify(order.paymentDetails));
      }
      console.log('  Subtotal:', order.subtotal);
      console.log('  Total:', order.total);
    });
    
    await mongoose.disconnect();
  } catch(e) {
    console.error('Error:', e.message);
    console.error(e);
    process.exit(1);
  }
}

debugOrders();
