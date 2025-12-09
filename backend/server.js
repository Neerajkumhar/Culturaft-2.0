require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
// Compression: gzip responses to reduce payload size
app.use(compression());

app.use(cors({
	origin: [
		"https://culturaft-2-0.vercel.app",
		"http://localhost:5173",
		"http://localhost:3000"
	],
	credentials: true
}));
app.use(express.json());

// Ensure CORS headers are present even if other middleware fails (helpful for serverless envs)
app.use((req, res, next) => {
	const allowed = [
		'https://culturaft-2-0.vercel.app',
		'https://culturaft-2-0.firebaseapp.com',
		'http://localhost:5173',
		'http://localhost:3000'
	];
	const origin = req.headers.origin;
	if (allowed.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
	}
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/culturaft';

connectDB(MONGODB_URI);

// Log unhandled rejections to help debugging on Vercel
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

// Static image serving is handled by the frontend static host (Vercel/CDN).
// Removing server-side `/img` static middleware to let the CDN serve images directly.

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send({ ok: true, name: 'Culturaft API' }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
