const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stats/overview
// @desc    Get dashboard overview statistics
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    // Get total plans
    const [plansResult] = await pool.execute('SELECT COUNT(*) as total FROM house_plans');
    const totalPlans = plansResult[0].total;

    // Get total downloads
    const [downloadsResult] = await pool.execute('SELECT COUNT(*) as total FROM downloads');
    const totalDownloads = downloadsResult[0].total;

    // Get revenue from paid plans
    const [revenueResult] = await pool.execute(`
      SELECT COALESCE(SUM(price), 0) as total 
      FROM house_plans 
      WHERE is_free = FALSE
    `);
    const totalRevenue = revenueResult[0].total;

    // Get active users (simulated - in real app this would track actual users)
    const activeUsers = Math.floor(Math.random() * 100) + 50; // Simulated data

    res.json({
      totalPlans,
      totalDownloads,
      totalRevenue: parseFloat(totalRevenue),
      activeUsers
    });
  } catch (error) {
    console.error('Get overview stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/recent-downloads
// @desc    Get recent download activity
// @access  Private
router.get('/recent-downloads', auth, async (req, res) => {
  try {
    const [downloads] = await pool.execute(`
      SELECT d.*, hp.name as plan_name, hp.download_count
      FROM downloads d
      JOIN house_plans hp ON d.plan_id = hp.id
      ORDER BY d.downloaded_at DESC
      LIMIT 10
    `);

    res.json(downloads);
  } catch (error) {
    console.error('Get recent downloads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/revenue-chart
// @desc    Get revenue data for charts
// @access  Private
router.get('/revenue-chart', auth, async (req, res) => {
  try {
    // Simulated revenue data for the last 12 months
    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 5000) + 1000
    }));

    res.json(revenueData);
  } catch (error) {
    console.error('Get revenue chart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/download-trends
// @desc    Get download trends for charts
// @access  Private
router.get('/download-trends', auth, async (req, res) => {
  try {
    // Simulated download trends for the last 30 days
    const downloadData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      downloads: Math.floor(Math.random() * 50) + 10
    }));

    res.json(downloadData);
  } catch (error) {
    console.error('Get download trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/plan-categories
// @desc    Get plan categories distribution
// @access  Private
router.get('/plan-categories', auth, async (req, res) => {
  try {
    const [freePlans] = await pool.execute('SELECT COUNT(*) as count FROM house_plans WHERE is_free = TRUE');
    const [paidPlans] = await pool.execute('SELECT COUNT(*) as count FROM house_plans WHERE is_free = FALSE');

    res.json([
      { category: 'Free Plans', count: freePlans[0].count, color: '#10B981' },
      { category: 'Paid Plans', count: paidPlans[0].count, color: '#3B82F6' }
    ]);
  } catch (error) {
    console.error('Get plan categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/top-plans
// @desc    Get top performing plans
// @access  Private
router.get('/top-plans', auth, async (req, res) => {
  try {
    const [plans] = await pool.execute(`
      SELECT hp.*, COUNT(d.id) as download_count
      FROM house_plans hp
      LEFT JOIN downloads d ON hp.id = d.plan_id
      GROUP BY hp.id
      ORDER BY download_count DESC
      LIMIT 10
    `);

    res.json(plans);
  } catch (error) {
    console.error('Get top plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 