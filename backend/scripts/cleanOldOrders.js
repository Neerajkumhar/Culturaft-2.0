/**
 * Migration script to clean up old orders that don't have shipping address and payment details
 * Run this once to prepare for invoice feature
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');

async function cleanOldOrders() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/culturaft';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find orders without shipping address or payment details
    const oldOrders = await Order.find({
      $or: [
        { shippingAddress: { $exists: false } },
        { paymentDetails: { $exists: false } },
        { shippingAddress: null },
        { paymentDetails: null }
      ]
    });

    console.log(`Found ${oldOrders.length} old orders without invoice details`);

    if (oldOrders.length > 0) {
      // Display orders to be deleted
      console.log('\nOrders to be deleted:');
      oldOrders.forEach(order => {
        console.log(`  - Order ID: ${order._id}, User: ${order.user}, Total: $${order.total}`);
      });

      // Delete old orders
      const result = await Order.deleteMany({
        $or: [
          { shippingAddress: { $exists: false } },
          { paymentDetails: { $exists: false } },
          { shippingAddress: null },
          { paymentDetails: null }
        ]
      });

      console.log(`\n✅ Successfully deleted ${result.deletedCount} old orders`);
      console.log('\nNext steps:');
      console.log('1. Log into the frontend');
      console.log('2. Add products to your cart');
      console.log('3. Complete checkout to create a new order with invoice data');
      console.log('4. Go to "My Orders" and click "View Invoice"');
    } else {
      console.log('✅ No old orders found. All orders have invoice details.');
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error cleaning old orders:', error);
    process.exit(1);
  }
}

cleanOldOrders();
