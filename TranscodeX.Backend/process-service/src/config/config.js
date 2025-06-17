require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

module.exports = {
  development: {
    username: process.env.PROCESS_DB_USER,
    password: process.env.PROCESS_DB_PASS,
    database: process.env.PROCESS_DB_NAME,
    host: process.env.PROCESS_DB_HOST_LOCAL,
    port: process.env.PROCESS_DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.PROCESS_DB_USER,
    password: process.env.PROCESS_DB_PASS,
    database: process.env.PROCESS_DB_NAME,
    host: process.env.PROCESS_DB_HOST,
    port: process.env.PROCESS_DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PROCESS_DB_USER,
    password: process.env.PROCESS_DB_PASS,
    database: process.env.PROCESS_DB_NAME,
    host: process.env.PROCESS_DB_HOST,
    port: process.env.PROCESS_DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
};
