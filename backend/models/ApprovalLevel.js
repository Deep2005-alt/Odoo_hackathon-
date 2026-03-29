const { sequelize } = require('../config/database');

const ApprovalLevel = sequelize.define('approval_level', {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  expense_id: {
    type: 'INTEGER',
    allowNull: false,
    references: {
      model: 'expenses',
      key: 'id',
    },
  },
  level_number: {
    type: 'INTEGER',
    allowNull: false,
  },
  approver_id: {
    type: 'INTEGER',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']],
    },
  },
  action: {
    type: 'STRING',
    allowNull: true,
    validate: {
      isIn: [['approve', 'reject']],
    },
  },
  comments: {
    type: 'TEXT',
    allowNull: true,
  },
  acted_at: {
    type: 'DATE',
    allowNull: true,
  },
  is_completed: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
}, {
  tableName: 'approval_levels',
});

module.exports = ApprovalLevel;
