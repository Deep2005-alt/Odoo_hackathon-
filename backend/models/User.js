const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('user', {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  company_id: {
    type: 'INTEGER',
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  name: {
    type: 'STRING',
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
  role: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'employee',
    validate: {
      isIn: [['employee', 'manager', 'admin']],
    },
  },
  department: {
    type: 'STRING',
    allowNull: true,
  },
  manager_id: {
    type: 'INTEGER',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  last_login: {
    type: 'DATE',
    allowNull: true,
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
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
User.prototype.getPublicProfile = function() {
  const { id, name, email, role, department, company_id, is_active, last_login } = this.get({ plain: true });
  return { id, name, email, role, department, company_id, is_active, last_login };
};

module.exports = User;
