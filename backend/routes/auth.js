require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Request body:', req.body);

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      // Query user from database
      const { rows } = await pool.query('SELECT id, email, password, role FROM users WHERE email = $1', [email]);
      if (rows.length === 0) {
        console.log('❌ Login failed - user not found:', email);
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = rows[0];

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Login failed - invalid password for:', email);
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check role (optional, if you want to restrict to admins)
      if (user.role !== 'admin') {
        console.log('❌ Login failed - not an admin:', email);
        return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
      }

      // Create JWT token
      const payload = { adminId: user.id };
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-2024'; // Fallback for local dev
      if (!process.env.JWT_SECRET) {
        console.warn('⚠️ JWT_SECRET not set, using default');
      }

      const token = await new Promise((resolve, reject) => {
        jwt.sign(payload, jwtSecret, { expiresIn: '24h' }, (err, token) => {
          if (err) reject(err);
          resolve(token);
        });
      });

      console.log('✅ Login successful for:', email);
      res.json({
        success: true,
        token,
        admin: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Fetch admin from database using adminId from JWT (set by auth middleware)
    const { rows } = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [req.admin.adminId]);
    if (rows.length === 0) {
      console.log('❌ Admin not found for ID:', req.admin.adminId);
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const admin = rows[0];
    console.log('✅ Fetched admin data for:', admin.email);
    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('❌ Get admin error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
