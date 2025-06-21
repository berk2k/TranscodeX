import jwt from 'jsonwebtoken';
import { jwt_config } from '../config/jwt.config.js';

export const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, jwt_config.jwtSecret, { expiresIn });
};

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwt_config.jwtSecret);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}
