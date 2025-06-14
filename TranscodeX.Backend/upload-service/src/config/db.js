const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(process.env.UPLOAD_DB_NAME, process.env.UPLOAD_DB_USER, process.env.UPLOAD_DB_PASS, {
  host: process.env.UPLOAD_DB_HOST,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
