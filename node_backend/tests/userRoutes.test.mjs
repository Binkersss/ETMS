import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

import userRoutes from '../routes/userRoutes.mjs';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Mock controller for isolated testing (optional)
vi.mock('../controllers/userController.mjs', () => ({
  getUserById: (req, res) => res.json({ user_id: req.params.id, username: 'testuser' }),
  updateUser: (req, res) => res.json({ ...req.body, user_id: req.params.id }),
}));

describe('User Routes', () => {
  it('GET /api/users/:id should return a user', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user_id: '1', username: 'testuser' });
  });

  it('PUT /api/users/:id should update a user', async () => {
    const res = await request(app)
      .put('/api/users/1')
      .send({ username: 'newname', email: 'new@email.com' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ user_id: '1', username: 'newname' });
  });
});
