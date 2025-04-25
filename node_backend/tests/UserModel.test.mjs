import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as UserModel from '../models/UserModel.mjs';
import db from '../db.mjs';

vi.mock('../db.mjs'); // mock the db connection

describe('UserModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a user by ID', async () => {
    const mockUser = { user_id: 1, username: 'nathaniel', email: 'test@example.com' };
    db.query.mockResolvedValue([[mockUser]]);

    const result = await UserModel.findById(1);
    expect(result).toEqual(mockUser);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE user_id = ?', [1]);
  });

  it('should update a user', async () => {
    const mockUser = { user_id: 1, username: 'updated', email: 'updated@example.com' };
    db.query.mockResolvedValueOnce([]); // for update query
    db.query.mockResolvedValueOnce([[mockUser]]); // for findById

    const result = await UserModel.update(1, {
      username: 'updated',
      email: 'updated@example.com'
    });

    expect(result).toEqual(mockUser);
    expect(db.query).toHaveBeenCalledTimes(2);
  });
});
