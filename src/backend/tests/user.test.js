// src/backend/tests/user.test.js
import { jest } from '@jest/globals';

// Mock the module BEFORE importing it
jest.unstable_mockModule('../database/db.js', () => ({
    default: {
    query: jest.fn(),
},
}));

// Now dynamically import the mocked modules
const pool = await import('../database/db.js');
const request = (await import('supertest')).default;
const app = (await import('../app.js')).default;

describe('User Controller - Signup', () => {
afterEach(() => {
    jest.clearAllMocks();
});

it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/users/signup').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Name is required');
});

it('should return 400 if invalid Gmail is provided', async () => {
    const res = await request(app).post('/api/users/signup').send({
        name: 'Test',
        email: 'test@yahoo.com',
        contact: '9800000000',
        address: 'Kathmandu',
        gender: 'male',
        password: 'Test@1234',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Only Gmail addresses are allowed');
});

it('should create user with valid data', async () => {
    pool.default.query.mockResolvedValue({
    rows: [{
        user_id: 1,
        name: 'Test User',
        email: 'test@gmail.com',
        role: 'user',
    }],
    });

    const res = await request(app).post('/api/users/signup').send({
        name: 'Test User',
        email: 'test@gmail.com',
        contact: '9800000000',
        address: 'Kathmandu',
        gender: 'male',
        password: 'Pass@123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
    expect(res.body.user).toHaveProperty('email', 'test@gmail.com');
    });
});
