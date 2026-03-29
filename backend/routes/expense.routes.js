const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Expense routes
router.post('/', expenseController.createExpense);
router.post('/:id/submit', expenseController.submitExpense);
router.get('/:id/approvals', expenseController.getApprovalHistory);

module.exports = router;
