const jwt = require('jsonwebtoken');
const { jwt_config } = require('../config/jwt.config');

const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, jwt_config.jwtSecret, { expiresIn });
};

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwt_config.jwtSecret);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
