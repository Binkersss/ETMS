import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.mjs";

describe('Server integration', () => {
    it('GET / should return 200', async () => {
        const response = await request(app).get('/api/ping');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'pong' });
    });

    
});