const express = require('express');
const router = express.Router();

const Admin = require('../models/admin.model');
const JWTUtils = require('../utils/jwt');
const Helpers = require('../utils/helpers');
const { authenticateAdmin, requirePermission } = require('../middleware/admin.middleware');
const { validate, validateRequired } = require('../middleware/validation.middleware');

// Admin Login
router.post('/login', [
  validateRequired(['username', 'password']),
  validate
], async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username or email
    const admin = await Admin.findForAuth(username);
    if (!admin) {
      return res.status(401).json(
        Helpers.formatError('Invalid credentials', 401)
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(401).json(
        Helpers.formatError('Admin account is deactivated', 401)
      );
    }

    // Check if admin is locked
    const isLocked = await Admin.isLocked(admin.id);
    if (isLocked) {
      return res.status(423).json(
        Helpers.formatError('Admin account is temporarily locked', 423)
      );
    }

    // Verify password
    const isPasswordValid = await Helpers.comparePassword(password, admin.password_hash);
    if (!isPasswordValid) {
      await Admin.incrementLoginAttempts(admin.id);
      return res.status(401).json(
        Helpers.formatError('Invalid credentials', 401)
      );
    }

    // Update last login
    await Admin.updateLastLogin(admin.id);

    // Generate JWT token
    const token = JWTUtils.generateAdminToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role
    });

    // Remove password from response
    delete admin.password_hash;

    res.json(
      Helpers.formatResponse(
        true,
        'Admin login successful',
        {
          admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            fullName: admin.full_name,
            role: admin.role,
            permissions: JSON.parse(admin.permissions || '[]'),
            lastLogin: admin.last_login
          },
          token
        }
      )
    );
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json(
      Helpers.formatError('Admin login failed', 500)
    );
  }
});

// Get Dashboard Metrics
router.get('/dashboard/metrics', [
  authenticateAdmin,
  requirePermission('analytics')
], async (req, res) => {
  try {
    const metrics = await Admin.getDashboardMetrics();
    
    res.json(
      Helpers.formatResponse(
        true,
        'Dashboard metrics retrieved successfully',
        metrics
      )
    );
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json(
      Helpers.formatError('Failed to load dashboard metrics', 500)
    );
  }
});

// Get Chart Data
router.get('/dashboard/charts', [
  authenticateAdmin,
  requirePermission('analytics')
], async (req, res) => {
  try {
    const chartData = await Admin.getChartData();
    
    res.json(
      Helpers.formatResponse(
        true,
        'Chart data retrieved successfully',
        chartData
      )
    );
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json(
      Helpers.formatError('Failed to load chart data', 500)
    );
  }
});

// Get Recent Activity
router.get('/dashboard/activity', [
  authenticateAdmin,
  requirePermission('analytics')
], async (req, res) => {
  try {
    const activity = await Admin.getRecentActivity(10);
    
    res.json(
      Helpers.formatResponse(
        true,
        'Recent activity retrieved successfully',
        activity
      )
    );
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json(
      Helpers.formatError('Failed to load recent activity', 500)
    );
  }
});

module.exports = router;