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
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      console.log('=== LOGIN ATTEMPT ===', { email });

      const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
      const admin = rows[0];
      if (!admin) {
        console.log('❌ Admin not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        console.log('❌ Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = { adminId: admin.id, email: admin.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      console.log('✅ Login successful, token generated');
      res.json({
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const { adminId } = req.user;
    const { rows } = await pool.query('SELECT id, email, name FROM admins WHERE id = $1', [adminId]);
    const admin = rows[0];
    if (!admin) {
      console.log('❌ Admin not found for /me');
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      admin: { id: admin.id, email: admin.email, name: admin.name }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
