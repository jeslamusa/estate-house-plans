require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// LOGIN ROUTE
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    console.log("🔐 Login attempt...");
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Error:", errors.array());
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    console.log(`➡️ Email: ${email}, Password: [HIDDEN]`);

    try {
      const { rows } = await pool.query(
        'SELECT id, email, password, role FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        console.log("❌ Email not found in DB");
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log("❌ Password mismatch");
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.role !== 'admin') {
        console.log("❌ User is not an admin");
        return res.status(403).json({ success: false, message: 'Admins only' });
      }

      const token = jwt.sign(
        { adminId: user.id },
        process.env.JWT_SECRET || 'default-secret-2024',
        { expiresIn: '24h' }
      );

      console.log("✅ Login successful!");
      res.json({
        success: true,
        token,
        admin: {
          id: user.id,
          email: user.email
        }
      });
    } catch (err) {
      console.error("🔥 Login Error:", err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// GET CURRENT ADMIN
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
    console.error("❌ Error in /me:", error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
