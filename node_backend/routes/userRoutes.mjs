import express from 'express';
import { getUserById, updateUser } from '../controllers/userController.mjs';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
