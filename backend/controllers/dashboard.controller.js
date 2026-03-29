const { Expense, ApprovalLevel, User, Company } = require('../models');
const { Op } = require('sequelize');

// @desc    Get dashboard data based on user role
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let dashboardData = {};

    if (role === 'employee') {
      dashboardData = await getEmployeeDashboard(userId);
    } else if (role === 'manager') {
      dashboardData = await getManagerDashboard(userId);
    } else if (role === 'admin') {
      dashboardData = await getAdminDashboard(userId);
    }

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

// Employee Dashboard
async function getEmployeeDashboard(userId) {
  // Get all expenses for this employee
  const expenses = await Expense.findAll({
    where: { employee_id: userId },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  // Calculate statistics
  const totalExpenses = await Expense.count({
    where: { employee_id: userId },
  });

  const pendingCount = await Expense.count({
    where: { 
      employee_id: userId,
      status: { [Op.or]: ['pending', 'submitted'] },
    },
  });

  const approvedCount = await Expense.count({
    where: { 
      employee_id: userId,
      status: 'approved',
    },
  });

  const rejectedCount = await Expense.count({
    where: { 
      employee_id: userId,
      status: 'rejected',
    },
  });

  const totalAmount = await Expense.sum('converted_amount', {
    where: { 
      employee_id: userId,
      status: 'approved',
    },
  });

  const pendingAmount = await Expense.sum('converted_amount', {
    where: { 
      employee_id: userId,
      status: { [Op.or]: ['pending', 'submitted'] },
    },
  });

  return {
    role: 'employee',
    statistics: {
      totalExpenses,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalAmount: totalAmount || 0,
      pendingAmount: pendingAmount || 0,
    },
    recentExpenses: expenses,
  };
}

// Manager Dashboard
async function getManagerDashboard(managerId) {
  // Get pending approvals
  const pendingApprovals = await ApprovalLevel.findAll({
    where: {
      approver_id: managerId,
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
    }],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  // Count pending approvals
  const pendingApprovalCount = await ApprovalLevel.count({
    where: {
      approver_id: managerId,
      status: 'pending',
      is_completed: false,
    },
  });

  // Get team expenses (simplified - would use org chart in real app)
  const manager = await User.findByPk(managerId, {
    include: [{
      model: Company,
      as: 'company',
    }],
  });

  const teamExpenses = await Expense.findAll({
    include: [{
      model: User,
      as: 'employee',
      where: {
        company_id: manager.company_id,
      },
    }],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  // Team statistics
  const teamTotalExpenses = await Expense.count({
    include: [{
      model: User,
      as: 'employee',
      where: {
        company_id: manager.company_id,
      },
    }],
  });

  const teamPendingCount = await Expense.count({
    where: {
      status: { [Op.or]: ['pending', 'submitted'] },
    },
    include: [{
      model: User,
      as: 'employee',
      where: {
        company_id: manager.company_id,
      },
    }],
  });

  const teamApprovedCount = await Expense.count({
    where: {
      status: 'approved',
    },
    include: [{
      model: User,
      as: 'employee',
      where: {
        company_id: manager.company_id,
      },
    }],
  });

  const teamTotalAmount = await Expense.sum('converted_amount', {
    include: [{
      model: User,
      as: 'employee',
      where: {
        company_id: manager.company_id,
      },
    }],
    where: {
      status: 'approved',
    },
  });

  return {
    role: 'manager',
    statistics: {
      pendingApprovalCount,
      teamTotalExpenses,
      teamPendingCount,
      teamApprovedCount,
      teamTotalAmount: teamTotalAmount || 0,
    },
    pendingApprovals,
    recentTeamExpenses: teamExpenses,
  };
}

// Admin Dashboard
async function getAdminDashboard(adminId) {
  // Get system-wide statistics
  const totalUsers = await User.count();
  const totalCompanies = await Company.count();
  const totalExpenses = await Expense.count();

  // Status breakdown
  const pendingCount = await Expense.count({
    where: { status: { [Op.or]: ['pending', 'submitted'] } },
  });

  const approvedCount = await Expense.count({
    where: { status: 'approved' },
  });

  const rejectedCount = await Expense.count({
    where: { status: 'rejected' },
  });

  const reimbursedCount = await Expense.count({
    where: { status: 'reimbursed' },
  });

  // Financial statistics
  const totalAmount = await Expense.sum('converted_amount', {
    where: { status: 'approved' },
  });

  const pendingAmount = await Expense.sum('converted_amount', {
    where: { status: { [Op.or]: ['pending', 'submitted'] } },
  });

  const reimbursedAmount = await Expense.sum('converted_amount', {
    where: { status: 'reimbursed' },
  });

  // Recent expenses across all companies
  const recentExpenses = await Expense.findAll({
    include: [{
      model: User,
      as: 'employee',
      attributes: ['id', 'name', 'email', 'company_id'],
    }],
    order: [['createdAt', 'DESC']],
    limit: 15,
  });

  // Top spenders (by approved amount)
  const topSpenders = await Expense.findAll({
    attributes: [
      'employee_id',
      [Expense.sequelize.fn('SUM', Expense.sequelize.col('converted_amount')), 'total_amount'],
      [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'expense_count'],
    ],
    where: { status: 'approved' },
    group: ['employee_id'],
    include: [{
      model: User,
      as: 'employee',
      attributes: ['id', 'name', 'email'],
    }],
    order: [[Expense.sequelize.literal('total_amount'), 'DESC']],
    limit: 5,
  });

  return {
    role: 'admin',
    overview: {
      totalUsers,
      totalCompanies,
      totalExpenses,
    },
    statusBreakdown: {
      pendingCount,
      approvedCount,
      rejectedCount,
      reimbursedCount,
    },
    financials: {
      totalAmount: totalAmount || 0,
      pendingAmount: pendingAmount || 0,
      reimbursedAmount: reimbursedAmount || 0,
    },
    recentExpenses,
    topSpenders,
  };
}

// @desc    Get expense statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    const whereClause = {};

    // Date filtering
    if (startDate || endDate) {
      whereClause.expense_date = {};
      if (startDate) whereClause.expense_date[Op.gte] = startDate;
      if (endDate) whereClause.expense_date[Op.lte] = endDate;
    }

    // Department/company filtering
    if (department && req.user.role === 'admin') {
      // Would filter by department in real app
    }

    const stats = await Expense.findAll({
      attributes: [
        'status',
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count'],
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('converted_amount')), 'total'],
      ],
      where: whereClause,
      group: ['status'],
    });

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
