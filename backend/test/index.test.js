// test/index.test.js

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('API Routes', () => {
  it('should return an API status on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('API is running...');
  });

  it('should return a list of users on GET /users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('should return a single user on GET /users:id', async () => {
    const userID = 1;

    const res = await request(app).get(`/users/${userID}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(Array.isArray(res.body.user)).toBe(true);
  });
});