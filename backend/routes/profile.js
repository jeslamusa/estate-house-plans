const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/profile/profile
// @desc    Get admin profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const [admin] = await pool.execute(
      'SELECT id, email, name, bio, phone, avatar_url, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', auth, upload.single('avatar'), [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('phone').optional().isMobilePhone(),
  body('bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, bio, phone } = req.body;
    let avatarUrl = null;

    // Handle avatar upload
    if (req.file) {
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    // Check if email is already taken by another admin
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM admins WHERE email = ? AND id != ?',
      [email, req.admin.id]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Update profile
    const updateFields = ['name = ?', 'email = ?', 'bio = ?', 'phone = ?'];
    const updateValues = [name, email, bio || null, phone || null];

    if (avatarUrl) {
      updateFields.push('avatar_url = ?');
      updateValues.push(avatarUrl);
    }

    updateValues.push(req.admin.id);

    await pool.execute(
      `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated profile
    const [updatedAdmin] = await pool.execute(
      'SELECT id, email, name, bio, phone, avatar_url, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );

    res.json(updatedAdmin[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword', 'Current password is required').notEmpty(),
  body('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current admin with password
    const [admin] = await pool.execute(
      'SELECT password_hash FROM admins WHERE id = ?',
      [req.admin.id]
    );

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.execute(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.admin.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 