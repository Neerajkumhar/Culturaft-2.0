require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors({
	origin: [
		"https://culturaft-2-0.vercel.app",
		"http://localhost:5173",
		"http://localhost:3000"
	],
	credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/culturaft';

connectDB(MONGODB_URI);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send({ ok: true, name: 'Culturaft API' }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
