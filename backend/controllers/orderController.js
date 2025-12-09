const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  const user = req.user;
  const { items, shippingAddress, paymentDetails, subtotal, shippingCost, total } = req.body;
  
  // Validate required fields
  if (!items || !shippingAddress || !paymentDetails) {
    return res.status(400).json({ message: 'Missing required fields: items, shippingAddress, paymentDetails' });
  }
  
  try {
    console.log('Creating order with:', {
      userId: user._id,
      itemsCount: items.length,
      hasShipping: !!shippingAddress,
      hasPayment: !!paymentDetails,
      shippingAddress,
      paymentDetails
    });
    
    // Populate product items with prices and tax rates
    const populated = await Promise.all(items.map(async (it) => {
      const p = await Product.findById(it.product);
      if (!p) throw new Error('Product not found');
      if (p.stock < it.qty) throw new Error(`Not enough stock for ${p.title}`);
      const price = p.price;
      const sgstRate = Number(p.sgst || 0);
      const cgstRate = Number(p.cgst || 0);
      const sgstAmount = +(price * it.qty * (sgstRate / 100));
      const cgstAmount = +(price * it.qty * (cgstRate / 100));
      return { product: p._id, qty: it.qty, priceAtPurchase: price, sgstRate, cgstRate, sgstAmount, cgstAmount };
    }));

    // Update user name from shipping address if provided
    if (shippingAddress.fullName && user) {
      await User.findByIdAndUpdate(user._id, { name: shippingAddress.fullName });
    }
    
    // Calculate totals (server authoritative)
    const subtotalCalculated = populated.reduce((s, it) => s + it.qty * it.priceAtPurchase, 0);
    const sgstTotal = populated.reduce((s, it) => s + (it.sgstAmount || 0), 0);
    const cgstTotal = populated.reduce((s, it) => s + (it.cgstAmount || 0), 0);
    const totalTax = sgstTotal + cgstTotal;
    const shippingCostValue = shippingCost || 0;
    const totalCalculated = subtotalCalculated + shippingCostValue + totalTax;

    // Create order with all checkout data
    const order = await Order.create({
      user: user._id,
      items: populated,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
      },
      paymentDetails: {
        method: paymentDetails.method,
        cardNumber: paymentDetails.cardNumber, // Already masked on frontend
        expiry: paymentDetails.expiry,
        cvc: paymentDetails.cvc,
      },
      subtotal: subtotalCalculated,
      shippingCost: shippingCostValue,
      sgstTotal,
      cgstTotal,
      totalTax,
      total: totalCalculated,
    });
    
    console.log('Order created:', {
      orderId: order._id,
      hasShipping: !!order.shippingAddress,
      hasPayment: !!order.paymentDetails
    });
    
    // Reduce stock
    await Promise.all(populated.map(async (it) => {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }));
    
    // Create admin notification with order details
    await Notification.create({
      type: 'new_order',
      data: {
        orderId: order._id,
        user: user._id,
        userName: shippingAddress.fullName,
        shippingCity: shippingAddress.city,
        total: totalCalculated,
      },
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(400).json({ message: err.message || 'Order error' });
  }
};

exports.getMyOrders = async (req, res) => {
  const user = req.user;
  const orders = await Order.find({ user: user._id }).populate('items.product');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // pending | accepted | shipped | delivered
  
  try {
    // Validate status
    const validStatuses = ['pending', 'accepted', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: pending, accepted, shipped, delivered' });
    }
    
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Skip if status is already the same
    if (order.status === status) {
      return res.json({ message: 'Status is already ' + status, order });
    }
    
    order.status = status;
    await order.save();
    
    // Create notification for status change
    try {
      const userName = order.shippingAddress?.fullName || 'Customer';
      await Notification.create({
        type: 'order_status',
        data: {
          orderId: order._id,
          status,
          userName: userName,
        },
      });
    } catch (notifErr) {
      console.error('Error creating notification:', notifErr);
      // Don't fail the request if notification creation fails
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

exports.getInvoice = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    // Validate user
    if (!user || !user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const order = await Order.findById(id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the user
    const userId = user._id?.toString?.() || String(user._id);
    const orderId = order.user?.toString?.() || String(order.user);
    
    if (orderId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check if order has required invoice fields (handle old orders without shipping/payment details)
    if (!order.shippingAddress || !order.paymentDetails) {
      console.log('Missing invoice details:', {
        hasShipping: !!order.shippingAddress,
        hasPayment: !!order.paymentDetails,
        shippingType: typeof order.shippingAddress,
        paymentType: typeof order.paymentDetails
      });
      return res.status(400).json({ message: 'This order does not have invoice details. Please place a new order to generate an invoice.' });
    }
    
    // Safely extract shipping address data
    let shippingAddressData = {
      fullName: 'N/A',
      address: 'N/A',
      city: 'N/A',
      postalCode: 'N/A',
    };
    
    try {
      if (order.shippingAddress) {
        shippingAddressData = {
          fullName: order.shippingAddress.fullName || 'N/A',
          address: order.shippingAddress.address || 'N/A',
          city: order.shippingAddress.city || 'N/A',
          postalCode: order.shippingAddress.postalCode || 'N/A',
        };
      }
    } catch (e) {
      console.error('Error extracting shipping address:', e.message);
    }
    
    // Safely extract payment method
    let paymentMethod = 'N/A';
    try {
      if (order.paymentDetails && order.paymentDetails.method) {
        paymentMethod = order.paymentDetails.method.charAt(0).toUpperCase() + order.paymentDetails.method.slice(1);
      }
    } catch (e) {
      console.error('Error extracting payment method:', e.message);
    }
    
    // Safely map items (include tax details if present)
    let items = [];
    try {
      if (order.items && Array.isArray(order.items)) {
        items = order.items.map(item => {
          const qty = item.qty || 0;
          const price = item.priceAtPurchase || 0;
          const sgstRate = item.sgstRate || 0;
          const cgstRate = item.cgstRate || 0;
          const sgstAmount = item.sgstAmount || 0;
          const cgstAmount = item.cgstAmount || 0;
          const total = qty * price;
          const totalWithTax = total + sgstAmount + cgstAmount;
          return {
            productName: item.product?.title || 'Product',
            productCategory: item.product?.category || 'N/A',
            quantity: qty,
            price: price,
            total: total,
            sgstRate,
            cgstRate,
            sgstAmount,
            cgstAmount,
            totalWithTax,
          };
        });
      }
    } catch (e) {
      console.error('Error mapping items:', e.message);
      items = [];
    }
    
    // Safely generate invoice number
    let invoiceNumber = 'INV-UNKNOWN';
    try {
      const idString = String(order._id);
      invoiceNumber = `INV-${idString.slice(-8).toUpperCase()}`;
    } catch (e) {
      console.error('Error generating invoice number:', e.message);
    }
    
    // Safely generate dates
    let invoiceDate = 'N/A';
    let dueDate = 'N/A';
    try {
      if (order.createdAt) {
        invoiceDate = new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const dueDateObj = new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);
        dueDate = dueDateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error('Error generating dates:', e.message);
    }
    
    // Generate invoice data
    const invoiceData = {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      orderNumber: order._id,
      status: order.status || 'pending',
      
      // Customer details
      customerName: shippingAddressData.fullName,
      customerEmail: user.email,
      
      // Shipping address
      shippingAddress: shippingAddressData,
      
      // Payment details
      paymentMethod: paymentMethod,
      
      // Items
      items: items,
      
      // Totals
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      sgstTotal: order.sgstTotal || 0,
      cgstTotal: order.cgstTotal || 0,
      totalTax: order.totalTax || 0,
      total: order.total || 0,
    };
    
    res.json(invoiceData);
  } catch (err) {
    console.error('Invoice generation error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Failed to generate invoice. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
