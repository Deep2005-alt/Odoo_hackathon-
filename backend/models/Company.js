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
  code: {
    type: 'STRING',
    allowNull: true,
    unique: true,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  industry: {
    type: 'STRING',
    allowNull: true,
  },
  size: {
    type: 'STRING',
    allowNull: true,
    validate: {
      isIn: [['small', 'medium', 'large', 'enterprise']],
    },
  },
  currency: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'USD',
  },
  timezone: {
    type: 'STRING',
    allowNull: true,
    defaultValue: 'UTC',
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  approval_policy: {
    type: 'JSON',
    allowNull: true,
    defaultValue: () => ({
      level1_threshold: 500,
      level2_threshold: 2000,
      level3_threshold: Infinity,
      urgent_fast_track: true,
    }),
  },
}, {
  tableName: 'companies',
  hooks: {
    beforeCreate: (company) => {
      if (!company.code) {
        company.code = company.name.toUpperCase().replace(/\s+/g, '_').substring(0, 10);
      }
    },
  },
});

module.exports = Company;
