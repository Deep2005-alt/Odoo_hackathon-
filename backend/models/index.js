const User = require('./User');
const Company = require('./Company');

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

module.exports = {
  User,
  Company,
};
