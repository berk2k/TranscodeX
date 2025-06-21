const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const jwt_config = {
  jwtSecret: process.env.JWT_SECRET_KEY
};

module.exports = {jwt_config};