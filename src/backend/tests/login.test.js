import { jest } from '@jest/globals';

// === 1. Properly MOCK bcryptjs with default export ===
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: jest.fn(() => true)
  }
}));

// === 2. MOCK db.js ===
jest.unstable_mockModule('../database/db.js', () => ({
  default: {
    query: jest.fn()
  }
}));

// === 3. DYNAMIC IMPORTS AFTER MOCKING ===
const bcrypt = (await import('bcryptjs')).default;
const pool = (await import('../database/db.js')).default;
const request = (await import('supertest')).default;
const app = (await import('../app.js')).default;

describe('User Controller - Login', () => {
    afterEach(() => {
    jest.clearAllMocks();
});

it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/users/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Please fill in all fields including role');
});

it('should return 400 if email is not Gmail', async () => {
    const res = await request(app).post('/api/users/login').send({
        email: 'user@yahoo.com',
        password: 'Test@1234',
        role: 'user'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Only Gmail addresses are allowed');
});

it('should return 400 for invalid password format', async () => {
    const res = await request(app).post('/api/users/login').send({
        email: 'user@gmail.com',
        password: 'short',
        role: 'user'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Password must be at least 8 characters');
});

it('should return 401 if user is not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app).post('/api/users/login').send({
        email: 'notfound@gmail.com',
        password: 'Test@1234',
        role: 'user'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
});

it('should return 401 if password is incorrect', async () => {
    pool.query.mockResolvedValue({
        rows: [{
            user_id: 1,
            name: 'Test User',
            email: 'test@gmail.com',
            password: '$2a$10$invalidhash',
            role: 'user'
        }]
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/api/users/login').send({
        email: 'test@gmail.com',
        password: 'Wrong@123',
        role: 'user'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
});

it('should login successfully with valid credentials', async () => {
    pool.query.mockResolvedValue({
        rows: [{
            user_id: 1,
            name: 'Valid User',
            email: 'valid@gmail.com',
            password: '$2a$10$dummyhash',
            role: 'user'
        }]
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/users/login').send({
        email: 'valid@gmail.com',
        password: 'Valid@1234',
        role: 'user'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'valid@gmail.com');
    });
});
