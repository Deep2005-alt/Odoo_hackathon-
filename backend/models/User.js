const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'employee',
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'users',
});

module.exports = User;
