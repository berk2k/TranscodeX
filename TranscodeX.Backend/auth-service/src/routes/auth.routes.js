import express from 'express';
import { validateController,login,register } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/validate', validateController);
router.post('/register', register);
router.post('/login', login);

export default router;