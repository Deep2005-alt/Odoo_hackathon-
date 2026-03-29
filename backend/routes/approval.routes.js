const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Approval routes - only accessible by managers and admins
router.get('/pending', expenseController.getPendingApprovals);
router.post('/:levelId/approve', expenseController.approveExpense);
router.post('/:levelId/reject', expenseController.approveExpense);

module.exports = router;
