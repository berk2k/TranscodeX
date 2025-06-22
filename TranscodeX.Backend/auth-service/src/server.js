const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const app = require('./app');
const sequelize = require('./config/db');
require('./models/user.model');

const PORT = process.env.AUTH_SERVICE_PORT_DOCKER;

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