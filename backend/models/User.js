const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('user', {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: 'STRING',
    allowNull: false,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  role: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'employee',
    validate: {
      isIn: [['admin', 'manager', 'employee']],
    },
  },
  company_id: {
    type: 'INTEGER',
    allowNull: true,
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
  instanceMethods: {
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    },
  },
});

module.exports = User;
