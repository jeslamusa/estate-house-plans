const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { pool, testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');
const statsRoutes = require('./routes/stats');
const profileRoutes = require('./routes/profile');

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS for production and dev
app.use(cors({
  origin: [
    'https://estate-house-plans.vercel.app',
    'https://estate-house-plans-exp7.onrender.com'
  ],
  credentials: true
}));

// JSON & URL encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

// Optional test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected', time: rows[0].now });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// 404 fallback route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await testConnection();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Backend: https://estate-house-x63y.onrender.com`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
