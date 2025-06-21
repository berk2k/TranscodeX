import jwt from 'jsonwebtoken';
import { jwt_config } from '../config/jwt.config.js';

export const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, jwt_config.jwtSecret, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwt_config.jwtSecret);
};
