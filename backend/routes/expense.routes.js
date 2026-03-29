const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { createExpenseValidation, approvalValidation } = require('../middleware/expense.middleware');

// All routes are protected
router.use(protect);

// Expense routes
router.post('/', createExpenseValidation, expenseController.createExpense);
router.post('/:id/submit', expenseController.submitExpense);
router.get('/:id/approvals', expenseController.getApprovalHistory);
router.post('/:id/receipt', upload.single('receipt'), expenseController.uploadReceipt);
router.post('/convert-currency', expenseController.convertCurrencyAmount);

module.exports = router;
