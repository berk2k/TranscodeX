const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(process.env.PROCESS_DB_NAME, process.env.PROCESS_DB_USER, process.env.PROCESS_DB_PASS, {
  host: process.env.PROCESS_DB_HOST,port: process.env.PROCESS_DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;

