const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { getNotifications, getOrders } = require('../controllers/adminController');

router.get('/notifications', authMiddleware, adminOnly, getNotifications);
router.get('/orders', authMiddleware, adminOnly, getOrders);

module.exports = router;
