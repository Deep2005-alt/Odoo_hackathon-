const { sequelize } = require('../config/database');

const Expense = sequelize.define('expense', {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  employee_id: {
    type: 'INTEGER',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  amount: {
    type: 'DECIMAL',
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'USD',
  },
  converted_amount: {
    type: 'DECIMAL',
    allowNull: true,
  },
  exchange_rate: {
    type: 'DECIMAL',
    allowNull: true,
    defaultValue: 1,
  },
  category: {
    type: 'STRING',
    allowNull: false,
    validate: {
      isIn: [['travel', 'meals', 'accommodation', 'office_supplies', 'training', 'equipment', 'other']],
    },
  },
  expense_date: {
    type: 'DATEONLY',
    allowNull: false,
  },
  receipt_url: {
    type: 'STRING',
    allowNull: true,
  },
  ocr_data: {
    type: 'JSON',
    allowNull: true,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'submitted', 'approved', 'rejected', 'reimbursed', 'cancelled']],
    },
  },
  current_approval_level: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  total_approval_levels: {
    type: 'INTEGER',
    defaultValue: 1,
  },
  is_urgent: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  submitted_at: {
    type: 'DATE',
    allowNull: true,
  },
  approved_at: {
    type: 'DATE',
    allowNull: true,
  },
  rejected_at: {
    type: 'DATE',
    allowNull: true,
  },
  reimbursed_at: {
    type: 'DATE',
    allowNull: true,
  },
}, {
  tableName: 'expenses',
  hooks: {
    beforeCreate: (expense) => {
      if (!expense.converted_amount) {
        expense.converted_amount = expense.amount;
      }
    },
  },
});

module.exports = Expense;
