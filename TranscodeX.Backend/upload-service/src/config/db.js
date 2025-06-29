const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(process.env.UPLOAD_DB_NAME, process.env.AZURE_DB_USER, process.env.AZURE_DB_PASS, {
  host: process.env.AZURE_DB_HOST,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  
  port: 5432
});

module.exports = sequelize;
