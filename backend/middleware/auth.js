require('dotenv').config();
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify JWT with environment secret
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-2024';
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ JWT_SECRET not set, using default');
    }
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch admin from database
    const { rows } = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [decoded.adminId]);
    if (rows.length === 0) {
      console.log('❌ Admin not found for ID:', decoded.adminId);
      return res.status(401).json({ success: false, message: 'Invalid token. Admin not found.' });
    }

    const admin = rows[0];
    if (admin.role !== 'admin') {
      console.log('❌ Not an admin:', admin.email);
      return res.status(403).json({ success: false, message: 'Access denied: Admins only.' });
    }

    console.log('✅ Auth successful for:', admin.email);
    req.admin = { adminId: admin.id, email: admin.email };
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', {
      message: error.message,
      stack: error.stack
    });
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = auth;
