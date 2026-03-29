const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'sqlite:./database.db',
  {
    dialect: 'sqlite',
    storage: './database.db',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
