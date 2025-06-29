const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const app = require('./app');
const sequelize = require('./config/db');
require('./models/upload.model');

console.log('UPLOAD SERVICE STARTED');
console.log('ENV TEST:', {
  B2_ENDPOINT: process.env.B2_ENDPOINT,
  DB_NAME: process.env.UPLOAD_DB_NAME,
  DB_USER: process.env.AZURE_DB_USER,
});

const PORT = process.env.UPLOAD_SERVICE_PORT_DOCKER;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection successful.');

    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();
