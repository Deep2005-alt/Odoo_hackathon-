const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { Company } = require('../models');

// @desc    Get all companies (Admin only)
// @route   GET /api/companies
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: companies.length,
      data: { companies },
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message,
    });
  }
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Check permissions - users can see their own company
    const isOwnCompany = req.user.companyId === parseInt(req.params.id);
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwnCompany) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this company',
      });
    }

    res.json({
      success: true,
      data: { company },
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message,
    });
  }
});

// @desc    Create a new company (Admin only)
// @route   POST /api/companies
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, code, description, industry, size, currency, approval_policy } = req.body;

    const company = await Company.create({
      name,
      code,
      description,
      industry,
      size,
      currency: currency || 'USD',
      approval_policy,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company },
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message,
    });
  }
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    await company.update(req.body);

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company },
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company',
      error: error.message,
    });
  }
});

module.exports = router;
