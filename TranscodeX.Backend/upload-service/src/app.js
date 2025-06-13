const sequelize = require('./config/db');


sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connection established.');
    return sequelize.sync(); // creates table when app started with upload.model
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });
