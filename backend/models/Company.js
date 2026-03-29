const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Company = sequelize.define('company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'companies',
});

module.exports = Company;
