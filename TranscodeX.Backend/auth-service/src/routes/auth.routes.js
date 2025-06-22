import express from 'express';
import { validateController } from '../controllers/validateController.js';

const router = express.Router();

router.get('/validate', validateController);

export default router;