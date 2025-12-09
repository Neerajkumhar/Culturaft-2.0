const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { getNotifications, getOrders, uploadImages, pingUpload } = require('../controllers/adminController');

// Image upload for admin (Cloudinary)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImages } = require('../controllers/adminController');

router.post('/upload', authMiddleware, adminOnly, upload.array('images', 4), uploadImages);
// lightweight ping for checking cloudinary availability
router.get('/ping-upload', pingUpload);

router.get('/notifications', authMiddleware, adminOnly, getNotifications);
router.get('/orders', authMiddleware, adminOnly, getOrders);

module.exports = router;
