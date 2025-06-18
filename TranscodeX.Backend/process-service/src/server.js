const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { startConsumer } = require('./queue/startConsumer');

const app = require('./app');
const sequelize = require('./config/db');


require('./models/job.model');

const PORT = 3002;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection successful.');

    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });

    startConsumer();
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();
