import express from 'express';
import { 
        getAllUsers,
        getUserById,
        createNewUser,
        updateUser,
        deleteUser,
        getAllCoaches
        } from '../controllers/userController.js';

const app = express();

app.get('/users', getAllUsers);
app.get('/users/:id', getUserById);
app.post('/users', createNewUser);
app.patch('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.get('/coaches', getAllCoaches);


export default app;