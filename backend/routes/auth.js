import express from 'express';
import { login } from '../controllers/authController.js';

const app = express();

app.post('/login', login);

export default app;