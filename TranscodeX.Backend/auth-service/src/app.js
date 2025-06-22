import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/login', authRoutes); 
app.use('/api/register', authRoutes); 

module.exports = app;
