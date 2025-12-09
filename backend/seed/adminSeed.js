require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/culturaft';

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB for seeding');
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@culturaft.test';
  const adminPass = process.env.SEED_ADMIN_PASS || 'adminpass';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hash = await bcrypt.hash(adminPass, 10);
    admin = await User.create({ name: 'Admin', email: adminEmail, passwordHash: hash, role: 'admin' });
    console.log('Admin user created:', adminEmail);
  } else {
    console.log('Admin already exists');
  }

  const sampleProducts = [
    { title: 'Handmade Ceramic Vase', price: 85.0, stock: 10, images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=500'], description: 'Beautiful handcrafted ceramic vase with traditional patterns', category: 'Pottery', featured: true },
    { title: 'Woven Cotton Scarf', price: 35.0, stock: 20, images: ['https://images.unsplash.com/photo-1520013573739-1b8495bc99dd?auto=format&fit=crop&q=80&w=500'], description: 'Soft organic cotton woven scarf', category: 'Textiles', featured: true },
    { title: 'Brass Home Decor Piece', price: 125.0, stock: 8, images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=500'], description: 'Elegant brass decorative sculpture', category: 'Home Decor', featured: false },
    { title: 'Beaded Necklace', price: 55.0, stock: 15, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500'], description: 'Handmade beaded necklace with semi-precious stones', category: 'Jewelry', featured: true },
    { title: 'Hand Painted Wall Art', price: 95.0, stock: 5, images: ['https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?auto=format&fit=crop&q=80&w=500'], description: 'Original hand-painted abstract art on canvas', category: 'Art', featured: false },
    { title: 'Embroidered Throw Pillow', price: 45.0, stock: 12, images: ['https://images.unsplash.com/photo-1578716755619-a741e2e72b5e?auto=format&fit=crop&q=80&w=500'], description: 'Decorative pillow with traditional embroidery', category: 'Home Decor', featured: true },
    { title: 'Handwoven Basket', price: 60.0, stock: 7, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=500'], description: 'Beautiful woven storage basket', category: 'Crafts', featured: false },
    { title: 'Wooden Jewelry Box', price: 72.0, stock: 10, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'], description: 'Hand-carved wooden jewelry storage box', category: 'Accessories', featured: true },
  ];

  for (const p of sampleProducts) {
    const exists = await Product.findOne({ title: p.title });
    if (!exists) {
      await Product.create(p);
      console.log('Created product', p.title);
    }
  }

  console.log('Seeding completed');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
