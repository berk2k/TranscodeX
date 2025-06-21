import { loginUser, createUser } from '../services/user.service.js';
import { verifyToken } from '../services/auth.service.js';

export const validateController = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const { valid, decoded, error } = verifyToken(token);
  if (!valid) {
    return res.status(401).json({ message: error.message });
  }

  res.setHeader('X-User-Id', decoded.userId);
  res.setHeader('X-Username', decoded.username);
  res.setHeader('X-User-Role', decoded.role);
  res.sendStatus(200);
};


export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const result = await loginUser({ identifier, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const register = async (req, res) => {
    const {username, email, password} = req.body;
    
    try {
        const result = await createUser({username,email,password})
        res.json(result);
    } catch (error) {
        res.status(400).json({message: err.message});
    }
};
