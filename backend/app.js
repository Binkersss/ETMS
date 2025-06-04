import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
