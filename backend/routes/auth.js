const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      console.log(`POST /api/auth/login: Missing email or password`);
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Query the database for the user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log(`POST /api/auth/login: User not found for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`POST /api/auth/login: Invalid password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Successful login (in a real app, generate a JWT or session token here)
    console.log(`POST /api/auth/login: Successful login for ${email}`);
    return res.json({ success: true });
  } catch (error) {
    console.error('POST /api/auth/login: Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
