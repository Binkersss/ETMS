import express from 'express';
import userRoutes from './routes/userRoutes.mjs';

const app = express();
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ message: 'pong' })); 

// Routes
app.use('/api/users', userRoutes);

// Only listen if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;