const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { getNotifications, getOrders } = require('../controllers/adminController');

// Image upload for admin (Cloudinary)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImages } = require('../controllers/adminController');

router.post('/upload', authMiddleware, adminOnly, upload.array('images', 4), uploadImages);

router.get('/notifications', authMiddleware, adminOnly, getNotifications);
router.get('/orders', authMiddleware, adminOnly, getOrders);

module.exports = router;
