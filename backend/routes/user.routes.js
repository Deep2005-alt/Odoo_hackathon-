const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { User, Company } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'code'],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'code'],
      }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.userId === parseInt(req.params.id);
    const isManager = req.user.role === 'manager';

    if (!isAdmin && !isOwnProfile && !isManager) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.userId === parseInt(req.params.id);

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    // Fields that can be updated
    const allowedFields = ['name', 'department', 'manager_id'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Admin can update role and is_active
    if (isAdmin) {
      if (req.body.role) updates.role = req.body.role;
      if (req.body.is_active !== undefined) updates.is_active = req.body.is_active;
    }

    await user.update(updates);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { 
        user: {
          ...user.toJSON(),
          password: undefined,
        }
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
});

module.exports = router;
