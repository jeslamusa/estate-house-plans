const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route   GET /api/plans
// @desc    Get all house plans (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Mock data for demo mode
    const mockPlans = [
      {
        id: 1,
        name: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space and large windows for natural light.',
        length: 24.0,
        width: 16.0,
        area: 384.0,
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/modern-family-home.pdf',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Luxury Villa',
        description: 'Spacious 4-bedroom luxury villa with premium finishes, swimming pool, and stunning architectural design.',
        length: 32.0,
        width: 20.0,
        area: 640.0,
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        price: 49.99,
        is_free: false,
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/luxury-villa.pdf',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Cozy Cottage',
        description: 'Charming 2-bedroom cottage perfect for small families or vacation homes with rustic appeal.',
        length: 18.0,
        width: 12.0,
        area: 216.0,
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/cozy-cottage.pdf',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Contemporary Townhouse',
        description: 'Modern 3-story townhouse with rooftop terrace, perfect for urban living with style.',
        length: 20.0,
        width: 14.0,
        area: 280.0,
        bedrooms: 3,
        bathrooms: 2.5,
        floors: 3,
        price: 29.99,
        is_free: false,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/contemporary-townhouse.pdf',
        created_at: new Date().toISOString()
      }
    ];

    console.log('Mock plans being returned:', mockPlans.map(p => ({ id: p.id, name: p.name, image_url: p.image_url })));

    res.json({
      plans: mockPlans,
      pagination: {
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plans/:id
// @desc    Get single house plan
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Mock data for demo mode
    const mockPlans = {
      1: {
        id: 1,
        name: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space and large windows for natural light.',
        length: 24.0,
        width: 16.0,
        area: 384.0,
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/modern-family-home.pdf',
        created_at: new Date().toISOString()
      },
      2: {
        id: 2,
        name: 'Luxury Villa',
        description: 'Spacious 4-bedroom luxury villa with premium finishes, swimming pool, and stunning architectural design.',
        length: 32.0,
        width: 20.0,
        area: 640.0,
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        price: 49.99,
        is_free: false,
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/luxury-villa.pdf',
        created_at: new Date().toISOString()
      },
      3: {
        id: 3,
        name: 'Cozy Cottage',
        description: 'Charming 2-bedroom cottage perfect for small families or vacation homes with rustic appeal.',
        length: 18.0,
        width: 12.0,
        area: 216.0,
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/cozy-cottage.pdf',
        created_at: new Date().toISOString()
      },
      4: {
        id: 4,
        name: 'Contemporary Townhouse',
        description: 'Modern 3-story townhouse with rooftop terrace, perfect for urban living with style.',
        length: 20.0,
        width: 14.0,
        area: 280.0,
        bedrooms: 3,
        bathrooms: 2.5,
        floors: 3,
        price: 29.99,
        is_free: false,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/contemporary-townhouse.pdf',
        created_at: new Date().toISOString()
      }
    };

    const plan = mockPlans[req.params.id];

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plans
// @desc    Create new house plan
// @access  Private
router.post('/', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'planFile', maxCount: 1 }
]), [
  body('name', 'Name is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('length', 'Length must be a positive number').isFloat({ min: 0 }),
  body('width', 'Width must be a positive number').isFloat({ min: 0 }),
  body('area', 'Area must be a positive number').isFloat({ min: 0 }),
  body('bedrooms', 'Bedrooms must be a positive integer').isInt({ min: 0 }),
  body('bathrooms', 'Bathrooms must be a positive integer').isInt({ min: 0 }),
  body('floors', 'Floors must be a positive integer').isInt({ min: 0 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('is_free').optional().isString().isIn(['true', 'false', '0', '1']).withMessage('is_free must be true, false, 0, or 1')
], async (req, res) => {
  try {
    console.log('Received plan data:', req.body)
    console.log('Received files:', req.files)
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array())
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, description, length, width, area,
      bedrooms, bathrooms, floors, price, is_free
    } = req.body;

    // Convert is_free to boolean
    const isFreeBoolean = is_free === 'true' || is_free === true;
    
    // Handle price for free plans
    const finalPrice = isFreeBoolean ? 0 : (price || 0);

    const imageUrl = req.files?.image ? `/uploads/images/${req.files.image[0].filename}` : null;
    const fileUrl = req.files?.planFile ? `/uploads/plans/${req.files.planFile[0].filename}` : null;

    console.log('Image URL being saved:', imageUrl);
    console.log('File URL being saved:', fileUrl);

    const [result] = await pool.execute(
      `INSERT INTO house_plans 
       (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free, image_url, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, length, width, area, bedrooms, bathrooms, floors, finalPrice, isFreeBoolean, imageUrl, fileUrl]
    );

    const [newPlan] = await pool.execute(
      'SELECT * FROM house_plans WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newPlan[0]);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/plans/:id
// @desc    Update house plan
// @access  Private
router.put('/:id', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'planFile', maxCount: 1 }
]), [
  body('name', 'Name is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('length', 'Length must be a positive number').isFloat({ min: 0 }),
  body('width', 'Width must be a positive number').isFloat({ min: 0 }),
  body('area', 'Area must be a positive number').isFloat({ min: 0 }),
  body('bedrooms', 'Bedrooms must be a positive integer').isInt({ min: 0 }),
  body('bathrooms', 'Bathrooms must be a positive integer').isInt({ min: 0 }),
  body('floors', 'Floors must be a positive integer').isInt({ min: 0 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('is_free').optional().isString().isIn(['true', 'false', '0', '1']).withMessage('is_free must be true, false, 0, or 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if plan exists
    const [existingPlans] = await pool.execute(
      'SELECT * FROM house_plans WHERE id = ?',
      [req.params.id]
    );

    if (existingPlans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const existingPlan = existingPlans[0];
    const {
      name, description, length, width, area,
      bedrooms, bathrooms, floors, price, is_free
    } = req.body;

    // Convert is_free to boolean
    const isFreeBoolean = is_free === 'true' || is_free === true;

    // Handle file uploads
    let imageUrl = existingPlan.image_url;
    let fileUrl = existingPlan.file_url;

    if (req.files?.image) {
      // Delete old image if exists
      if (existingPlan.image_url) {
        const oldImagePath = path.join(__dirname, '..', existingPlan.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/images/${req.files.image[0].filename}`;
    }

    if (req.files?.planFile) {
      // Delete old plan file if exists
      if (existingPlan.file_url) {
        const oldPlanPath = path.join(__dirname, '..', existingPlan.file_url);
        if (fs.existsSync(oldPlanPath)) {
          fs.unlinkSync(oldPlanPath);
        }
      }
      fileUrl = `/uploads/plans/${req.files.planFile[0].filename}`;
    }

    await pool.execute(
      `UPDATE house_plans SET 
       name = ?, description = ?, length = ?, width = ?, area = ?,
       bedrooms = ?, bathrooms = ?, floors = ?, price = ?, is_free = ?,
       image_url = ?, file_url = ?
       WHERE id = ?`,
      [name, description, length, width, area, bedrooms, bathrooms, floors, price, isFreeBoolean, imageUrl, fileUrl, req.params.id]
    );

    const [updatedPlan] = await pool.execute(
      'SELECT * FROM house_plans WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedPlan[0]);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/plans/:id
// @desc    Delete house plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if plan exists
    const [existingPlans] = await pool.execute(
      'SELECT * FROM house_plans WHERE id = ?',
      [req.params.id]
    );

    if (existingPlans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const existingPlan = existingPlans[0];

    // Delete associated files
    if (existingPlan.image_url) {
      const imagePath = path.join(__dirname, '..', existingPlan.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (existingPlan.file_url) {
      const planPath = path.join(__dirname, '..', existingPlan.file_url);
      if (fs.existsSync(planPath)) {
        fs.unlinkSync(planPath);
      }
    }

    // Delete from database (cascade will handle downloads)
    await pool.execute('DELETE FROM house_plans WHERE id = ?', [req.params.id]);

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plans/:id/download
// @desc    Track plan download
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    // Check if plan exists
    const [plans] = await pool.execute(
      'SELECT * FROM house_plans WHERE id = ?',
      [req.params.id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const plan = plans[0];

    // Record download
    await pool.execute(
      'INSERT INTO downloads (plan_id) VALUES (?)',
      [req.params.id]
    );

    // Update download count
    await pool.execute(
      'UPDATE house_plans SET download_count = download_count + 1 WHERE id = ?',
      [req.params.id]
    );

    // Return file URL for download
    res.json({
      message: 'Download recorded',
      fileUrl: plan.file_url,
      isFree: plan.is_free
    });
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plans/purchase
// @desc    Submit purchase request for a house plan
// @access  Public
router.post('/purchase', async (req, res) => {
  try {
    const { planId, name, email, phone, address, message } = req.body;

    console.log('=== PURCHASE REQUEST ===');
    console.log('Plan ID:', planId);
    console.log('Customer:', { name, email, phone, address, message });

    // Mock plan data for demo
    const mockPlans = {
      1: { name: 'Modern Family Home', price: 0.00 },
      2: { name: 'Luxury Villa', price: 49.99 },
      3: { name: 'Cozy Cottage', price: 0.00 },
      4: { name: 'Contemporary Townhouse', price: 29.99 }
    };

    const plan = mockPlans[planId];
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Create purchase record (in demo mode, just log it)
    const purchaseData = {
      id: Date.now(),
      planId: parseInt(planId),
      planName: plan.name,
      planPrice: plan.price,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      customerMessage: message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Purchase Data:', purchaseData);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to customer
    // 4. Process payment

    // For demo, we'll just return success
    res.json({
      success: true,
      message: 'Purchase request submitted successfully!',
      purchaseId: purchaseData.id,
      notification: {
        title: 'New Purchase Request',
        message: `${name} wants to purchase ${plan.name}`,
        customerPhone: phone,
        customerEmail: email
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Failed to submit purchase request' });
  }
});

module.exports = router; 