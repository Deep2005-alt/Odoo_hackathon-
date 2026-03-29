const User = require('./User');
const Company = require('./Company');
const Expense = require('./Expense');
const ApprovalLevel = require('./ApprovalLevel');

// Define associations
User.belongsTo(Company, { 
  foreignKey: 'company_id', 
  as: 'company',
  onDelete: 'SET NULL'
});

Company.hasMany(User, { 
  foreignKey: 'company_id', 
  as: 'users' 
});

// Expense associations
Expense.belongsTo(User, {
  foreignKey: 'employee_id',
  as: 'employee',
});

User.hasMany(Expense, {
  foreignKey: 'employee_id',
  as: 'expenses',
});

// Approval Level associations
ApprovalLevel.belongsTo(Expense, {
  foreignKey: 'expense_id',
  as: 'expense',
  onDelete: 'CASCADE',
});

Expense.hasMany(ApprovalLevel, {
  foreignKey: 'expense_id',
  as: 'approvalLevels',
});

ApprovalLevel.belongsTo(User, {
  foreignKey: 'approver_id',
  as: 'approver',
});

User.hasMany(ApprovalLevel, {
  foreignKey: 'approver_id',
  as: 'approvalTasks',
});

module.exports = {
  User,
  Company,
  Expense,
  ApprovalLevel,
};
