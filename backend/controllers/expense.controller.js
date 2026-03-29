const { Expense, ApprovalLevel, User, Company } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private (Employee)
exports.createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      title,
      description,
      amount,
      currency,
      category,
      expense_date,
      is_urgent,
    } = req.body;

    // Create expense
    const expense = await Expense.create({
      employee_id: req.user.userId,
      title,
      description,
      amount,
      currency: currency || 'USD',
      converted_amount: amount, // Will be updated by currency conversion service
      category,
      expense_date,
      is_urgent: is_urgent || false,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense },
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message,
    });
  }
};

// @desc    Submit expense for approval
// @route   POST /api/expenses/:id/submit
// @access  Private (Employee)
exports.submitExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        employee_id: req.user.userId,
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    if (expense.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Expense is already ${expense.status}`,
      });
    }

    // Determine approval workflow based on amount and company rules
    const totalLevels = determineApprovalLevels(expense.amount, expense.is_urgent);
    
    // Get approvers based on company hierarchy
    const approvers = await getApproversForExpense(expense.employee_id, totalLevels);

    // Update expense status
    expense.status = 'submitted';
    expense.total_approval_levels = totalLevels;
    expense.current_approval_level = 1;
    expense.submitted_at = new Date();
    await expense.save();

    // Create approval levels
    const approvalLevelsData = approvers.map((approverId, index) => ({
      expense_id: expense.id,
      level_number: index + 1,
      approver_id: approverId,
      status: 'pending',
    }));

    await ApprovalLevel.bulkCreate(approvalLevelsData);

    res.json({
      success: true,
      message: 'Expense submitted for approval',
      data: { 
        expense,
        totalLevels,
        currentLevel: 1,
      },
    });
  } catch (error) {
    console.error('Submit expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting expense',
      error: error.message,
    });
  }
};

// @desc    Approve or reject expense
// @route   POST /api/approvals/:levelId/approve or /api/approvals/:levelId/reject
// @access  Private (Manager)
exports.approveExpense = async (req, res) => {
  try {
    const { action, comments } = req.body;
    const levelId = req.params.levelId;

    // Find approval level
    const approvalLevel = await ApprovalLevel.findByPk(levelId, {
      include: [{
        model: Expense,
        as: 'expense',
        include: [{
          model: User,
          as: 'employee',
        }],
      }],
    });

    if (!approvalLevel) {
      return res.status(404).json({
        success: false,
        message: 'Approval level not found',
      });
    }

    // Verify the user is the assigned approver
    if (approvalLevel.approver_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this expense',
      });
    }

    // Check if already acted
    if (approvalLevel.is_completed) {
      return res.status(400).json({
        success: false,
        message: 'Already acted on this approval',
      });
    }

    // Update approval level
    approvalLevel.status = action === 'approve' ? 'approved' : 'rejected';
    approvalLevel.action = action;
    approvalLevel.comments = comments;
    approvalLevel.acted_at = new Date();
    approvalLevel.is_completed = true;
    await approvalLevel.save();

    const expense = approvalLevel.expense;

    if (action === 'reject') {
      // Reject entire expense
      expense.status = 'rejected';
      expense.rejected_at = new Date();
      await expense.save();

      return res.json({
        success: true,
        message: 'Expense rejected',
        data: { expense, approvalLevel },
      });
    }

    // Check if there are more levels
    const nextLevel = await ApprovalLevel.findOne({
      where: {
        expense_id: expense.id,
        level_number: approvalLevel.level_number + 1,
      },
    });

    if (nextLevel) {
      // Move to next approval level
      expense.current_approval_level = approvalLevel.level_number + 1;
      await expense.save();

      res.json({
        success: true,
        message: 'Approved - forwarded to next level',
        data: { 
          expense, 
          approvalLevel,
          nextApprover: nextLevel.approver_id,
        },
      });
    } else {
      // All levels approved
      expense.status = 'approved';
      expense.approved_at = new Date();
      expense.current_approval_level = expense.total_approval_levels;
      await expense.save();

      res.json({
        success: true,
        message: 'Expense fully approved',
        data: { expense, approvalLevel },
      });
    }
  } catch (error) {
    console.error('Approve expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing approval',
      error: error.message,
    });
  }
};

// @desc    Get pending approvals for manager
// @route   GET /api/approvals/pending
// @access  Private (Manager/Admin)
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingApprovals = await ApprovalLevel.findAll({
      where: {
        approver_id: req.user.userId,
        status: 'pending',
        is_completed: false,
      },
      include: [{
        model: Expense,
        as: 'expense',
        include: [{
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'email'],
        }],
        attributes: {
          exclude: ['ocr_data'],
        },
      }],
      order: [['level_number', 'ASC']],
    });

    res.json({
      success: true,
      count: pendingApprovals.length,
      data: { pendingApprovals },
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending approvals',
      error: error.message,
    });
  }
};

// @desc    Get approval history for expense
// @route   GET /api/expenses/:id/approvals
// @access  Private
exports.getApprovalHistory = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [{
        model: ApprovalLevel,
        as: 'approvalLevels',
        include: [{
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'email', 'role'],
        }],
      }, {
        model: User,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
      }],
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check permissions
    const isOwner = expense.employee_id === req.user.userId;
    const isApprover = expense.approvalLevels.some(
      level => level.approver_id === req.user.userId
    );
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isApprover && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this expense',
      });
    }

    res.json({
      success: true,
      data: { expense },
    });
  } catch (error) {
    console.error('Get approval history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching approval history',
      error: error.message,
    });
  }
};

// Helper function to determine approval levels based on amount
function determineApprovalLevels(amount, isUrgent) {
  if (isUrgent) {
    return 1; // Urgent expenses get fast-tracked
  }
  
  if (amount <= 500) {
    return 1; // Single level for small amounts
  } else if (amount <= 2000) {
    return 2; // Two levels for medium amounts
  } else {
    return 3; // Three levels for large amounts
  }
}

// Helper function to get approvers based on hierarchy
async function getApproversForExpense(employeeId, totalLevels) {
  const approvers = [];
  
  // Get the employee's details
  const employee = await User.findByPk(employeeId, {
    include: [{
      model: Company,
      as: 'company',
    }],
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Level 1: Direct manager (simplified - in real app would use org chart)
  const directManager = await User.findOne({
    where: {
      company_id: employee.company_id,
      role: 'manager',
    },
    limit: 1,
  });

  if (directManager) {
    approvers.push(directManager.id);
  }

  // Level 2: Senior manager or department head
  if (totalLevels >= 2) {
    const seniorManager = await User.findOne({
      where: {
        company_id: employee.company_id,
        role: 'manager',
      },
      // In real app, would filter by department/seniority
      offset: approvers.length > 0 ? 1 : 0,
      limit: 1,
    });

    if (seniorManager) {
      approvers.push(seniorManager.id);
    } else if (directManager) {
      // Fallback to same manager
      approvers.push(directManager.id);
    }
  }

  // Level 3: Admin or finance head
  if (totalLevels >= 3) {
    const admin = await User.findOne({
      where: {
        company_id: employee.company_id,
        role: 'admin',
      },
      limit: 1,
    });

    if (admin) {
      approvers.push(admin.id);
    } else if (approvers.length < totalLevels && directManager) {
      // Fallback to previous approvers
      approvers.push(directManager.id);
    }
  }

  // Ensure we have enough approvers
  while (approvers.length < totalLevels && approvers.length > 0) {
    approvers.push(approvers[approvers.length - 1]);
  }

  return approvers;
}
