const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { createOrder, getMyOrders, updateOrderStatus, getInvoice } = require('../controllers/orderController');

// More specific routes first
router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);
router.get('/:id/invoice', authMiddleware, getInvoice);

module.exports = router;
