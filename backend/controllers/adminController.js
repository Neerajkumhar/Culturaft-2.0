const Order = require('../models/Order');
const Notification = require('../models/Notification');
const streamifier = require('streamifier');

// Note: require('cloudinary') can throw at module-load time if the package
// isn't installed in the deployment environment. To avoid crashing the
// entire serverless function on import errors, we require and configure
// Cloudinary lazily inside handlers and surface a helpful error message.

function configureCloudinary() {
  try {
    const cloudinary = require('cloudinary').v2;
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
    return cloudinary;
  } catch (err) {
    // Return null so callers can handle missing dependency gracefully
    return null;
  }
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
  // Lazily configure cloudinary; if it's not available, return a clear error
  const cloudinary = configureCloudinary();
  if (!cloudinary) {
    console.error('Cloudinary module not available in runtime');
    return res.status(500).json({ message: 'Cloudinary is not configured on the server. Ensure the cloudinary package is installed and CLOUDINARY_URL is set.' });
  }

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

// Lightweight ping endpoint to verify Cloudinary env + dependency at runtime
exports.pingUpload = (req, res) => {
  const cloudinary = configureCloudinary();
  res.json({ ok: true, cloudinaryConfigured: !!process.env.CLOUDINARY_URL, cloudinaryAvailable: !!cloudinary });
};
