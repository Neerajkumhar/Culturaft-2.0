const Order = require('../models/Order');
const Notification = require('../models/Notification');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure cloudinary from CLOUDINARY_URL env or explicit vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

exports.getNotifications = async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json(notes);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
  res.json(orders);
};

// Admin image upload handler — uploads files in req.files to Cloudinary and returns secure URLs
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'culturaft/products', resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url || result.url);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};
