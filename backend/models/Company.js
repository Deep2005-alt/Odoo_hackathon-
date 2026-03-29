const { sequelize } = require('../config/database');

const Company = sequelize.define('company', {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  base_currency: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'USD',
  },
  address: {
    type: 'STRING',
    allowNull: true,
  },
  phone: {
    type: 'STRING',
    allowNull: true,
  },
  industry: {
    type: 'STRING',
    allowNull: true,
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
}, {
  tableName: 'companies',
});

module.exports = Company;
