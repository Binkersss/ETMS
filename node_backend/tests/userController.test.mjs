import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as UserModel from '../models/UserModel.mjs';
import { getUserById, updateUser } from '../controllers/userController.mjs';

vi.mock('../models/UserModel.mjs');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '123' }, body: { username: 'newname' } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('getUserById returns user if found', async () => {
    UserModel.findById.mockResolvedValue({ id: '123', username: 'testuser' });

    await getUserById(req, res);

    expect(UserModel.findById).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith({ id: '123', username: 'testuser' });
  });

  it('getUserById returns 404 if not found', async () => {
    UserModel.findById.mockResolvedValue(null);

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('updateUser returns updated user', async () => {
    const updatedUser = { id: '123', username: 'newname' };
    UserModel.update.mockResolvedValue(updatedUser);

    await updateUser(req, res);

    expect(UserModel.update).toHaveBeenCalledWith('123', { username: 'newname' });
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });
});
