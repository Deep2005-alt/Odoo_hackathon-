const { Expense, ApprovalLevel } = require('../models');

// Store active connections (in-memory, for production use Redis)
const activeConnections = new Map();

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lastCheck } = req.query;

    const whereClause = {};

    // For managers - get pending approvals
    if (req.user.role === 'manager' || req.user.role === 'admin') {
      const pendingApprovals = await ApprovalLevel.findAll({
        where: {
          approver_id: userId,
          status: 'pending',
          is_completed: false,
        },
        include: [{
          model: Expense,
          as: 'expense',
          attributes: ['id', 'title', 'amount', 'status'],
        }],
        order: [['createdAt', 'DESC']],
      });

      whereClause.approver_id = userId;
    }

    // Get expenses that need attention
    const updatedExpenses = await Expense.findAll({
      where: whereClause,
      order: [['updatedAt', 'DESC']],
      limit: 20,
    });

    res.json({
      success: true,
      data: {
        pendingApprovals: pendingApprovals || [],
        updatedExpenses,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

// @desc    Subscribe to real-time updates (long polling)
// @route   GET /api/notifications/subscribe
// @access  Private
exports.subscribeToUpdates = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lastEventId } = req.query;

    // Store connection
    activeConnections.set(userId, {
      res,
      lastEventId,
      connectedAt: new Date(),
    });

    // Set timeout for long polling (30 seconds)
    const timeout = setTimeout(() => {
      sendUpdate(userId, { type: 'heartbeat', timestamp: new Date().toISOString() });
    }, 10000);

    // Clean up on disconnect
    req.on('close', () => {
      clearTimeout(timeout);
      activeConnections.delete(userId);
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to updates',
      error: error.message,
    });
  }
};

// Helper function to send updates to connected clients
async function sendUpdate(userId, data) {
  const connection = activeConnections.get(userId);
  if (connection && !connection.res.writableEnded) {
    connection.res.json({
      success: true,
      data,
    });
    // Remove after sending
    activeConnections.delete(userId);
  }
}

// Broadcast update to all relevant users
exports.broadcastExpenseUpdate = async (expenseId, eventType) => {
  try {
    const expense = await Expense.findByPk(expenseId, {
      include: [
        { model: User, as: 'employee' },
        { model: ApprovalLevel, as: 'approvalLevels' },
      ],
    });

    if (!expense) return;

    const updateData = {
      type: eventType,
      expenseId,
      status: expense.status,
      timestamp: new Date().toISOString(),
    };

    // Notify employee
    sendUpdate(expense.employee_id, updateData);

    // Notify all approvers
    if (expense.approvalLevels) {
      expense.approvalLevels.forEach(level => {
        sendUpdate(level.approver_id, updateData);
      });
    }
  } catch (error) {
    console.error('Broadcast error:', error);
  }
};

module.exports = exports;
