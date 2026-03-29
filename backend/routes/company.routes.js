const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Placeholder controller functions
const companyController = {
  getCompanies: async (req, res) => {
    const { Company } = require('../models');
    try {
      const companies = await Company.findAll();
      res.json({ success: true, data: { companies } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

// All routes protected
router.use(protect);

router.get('/', companyController.getCompanies);

module.exports = router;
