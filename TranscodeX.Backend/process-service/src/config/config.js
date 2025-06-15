const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  development: {
    username: process.env.PROCESS_DB_USER,
    password: process.env.PROCESS_DB_PASS,
    database: process.env.PROCESS_DB_NAME,
    host: process.env.PROCESS_DB_HOST,
    dialect: 'postgres',
  },
};
