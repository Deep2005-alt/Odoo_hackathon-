const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Expense routes
router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpenseDraft);
router.delete('/:id', expenseController.deleteExpenseDraft);
router.post('/:id/submit', expenseController.submitExpense);
router.get('/:id/approvals', expenseController.getApprovalHistory);
router.post('/ocr', upload.single('receipt'), expenseController.uploadReceiptOCR);

module.exports = router;
