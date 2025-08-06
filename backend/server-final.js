require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const { email, password } = req.body;
      const { rows } = await pool.query('SELECT id, email, password, role FROM users WHERE email = $1', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admins only' });
      }

      const token = jwt.sign({ adminId: user.id }, process.env.JWT_SECRET || 'default-secret-2024', { expiresIn: '24h' });

      res.json({
        success: true,
        token,
        admin: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [req.admin.adminId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const admin = rows[0];
    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

