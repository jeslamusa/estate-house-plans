require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router(); // ✅ THIS was missing before

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    // ✅ Simple hardcoded login check for testing
    if (email === 'admin@estateplans.com' && password === 'admin123') {
      console.log('✅ Login successful!');

      const payload = { adminId: 1 };
      const jwtSecret = 'simple-secret-2024'; // Or use process.env.JWT_SECRET

      jwt.sign(payload, jwtSecret, { expiresIn: '24h' }, (err, token) => {
        if (err) {
          console.error('JWT error:', err);
          return res.status(500).json({ message: 'Token error' });
        }

        console.log('✅ Token created successfully');
        res.json({
          token,
          admin: {
            id: 1,
            email: 'admin@estateplans.com'
          }
        });
      });
    } else {
      console.log('❌ Login failed - invalid credentials');
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const mockAdmin = {
      id: 1,
      email: 'admin@estateplans.com'
    };

    res.json({
      admin: {
        id: mockAdmin.id,
        email: mockAdmin.email
      }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

