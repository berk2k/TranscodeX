const jwt = require('jsonwebtoken');
const { jwt_config } = require('../config/jwt.config');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwt_config.jwtSecret);

    req.user = decoded;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Invalid user data in token.' });
    }

    console.log('Token successfully verified:', decoded);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error: Invalid token format or signature.');
      return res.status(400).json({ message: 'Invalid token format or signature.' });
    }

    if (error.name === 'TokenExpiredError') {
      console.error('JWT Error: Token expired.');
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }

    console.error('JWT Error:', error.message);
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
