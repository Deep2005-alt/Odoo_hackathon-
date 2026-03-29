const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'sqlite',
  storage: './backend/database.db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
