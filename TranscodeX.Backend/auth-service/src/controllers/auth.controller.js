import { loginUser, createUser } from '../services/user.service.js';

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
