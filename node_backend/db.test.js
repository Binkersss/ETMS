// db.test.js
import { describe, it, expect, vi } from 'vitest';
import dotenv from 'dotenv';

dotenv.config();

// Mock mariadb with a default export
vi.mock('mariadb', () => {
  return {
    default: {
      createPool: vi.fn().mockReturnValue({
        getConnection: vi.fn().mockResolvedValue({
          release: vi.fn()
        })
      })
    }
  };
});

import mariadb from 'mariadb'; // this now works due to the fixed mock
import pool from './db.mjs';    // make sure the extension is included in ESM

describe('Database Pool', () => {
  it('should create a pool with the correct configuration', () => {
    expect(mariadb.createPool).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 5
    });
  });

  it('should allow getting a connection from the pool', async () => {
    const connection = await pool.getConnection();
    expect(connection).toHaveProperty('release');
  });
});

describe('Database Pool - Additional Tests', () => {
    it('should throw an error if getting a connection fails', async () => {
        const errorMessage = 'Failed to get connection';
        mariadb.createPool().getConnection.mockRejectedValueOnce(new Error(errorMessage));

        await expect(pool.getConnection()).rejects.toThrow(errorMessage);
    });

    it('should release the connection after usage', async () => {
        const mockConnection = {
            release: vi.fn()
        };
        mariadb.createPool().getConnection.mockResolvedValueOnce(mockConnection);

        const connection = await pool.getConnection();
        connection.release();

        expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should handle multiple connections being requested', async () => {
        const mockConnection1 = { release: vi.fn() };
        const mockConnection2 = { release: vi.fn() };

        mariadb.createPool().getConnection
            .mockResolvedValueOnce(mockConnection1)
            .mockResolvedValueOnce(mockConnection2);

        const connection1 = await pool.getConnection();
        const connection2 = await pool.getConnection();

        expect(connection1).toHaveProperty('release');
        expect(connection2).toHaveProperty('release');
        expect(connection1).not.toBe(connection2);
    });

    it('should use the correct environment variables for configuration', () => {
        expect(process.env.DB_HOST).toBeDefined();
        expect(process.env.DB_USER).toBeDefined();
        expect(process.env.DB_PASSWORD).toBeDefined();
        expect(process.env.DB_NAME).toBeDefined();
    });
});
