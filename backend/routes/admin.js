const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { getNotifications, getOrders, pingUpload } = adminController;

// Image upload for admin (Cloudinary)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', authMiddleware, adminOnly, upload.array('images', 4), adminController.uploadImages);
// lightweight ping for checking cloudinary availability
router.get('/ping-upload', pingUpload);

router.get('/notifications', authMiddleware, adminOnly, getNotifications);
router.get('/orders', authMiddleware, adminOnly, getOrders);

module.exports = router;
