const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(process.env.AUTH_DB_NAME, process.env.AUTH_DB_USER, process.env.AUTH_DB_PASS, {
  host: process.env.AUTH_DB_HOST,port: process.env.AUTH_DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
});

const jwt_config = {
  jwtSecret: process.env.JWT_SECRET_KEY
};

module.exports = {sequelize,jwt_config};