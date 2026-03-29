const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/', dashboardController.getDashboard);
router.get('/stats', dashboardController.getStats);

module.exports = router;
