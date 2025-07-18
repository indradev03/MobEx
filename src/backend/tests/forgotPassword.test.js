    // src/backend/tests/forgotPassword.test.js

    import { jest } from '@jest/globals';

    // ✅ MOCK nodemailer only
    jest.unstable_mockModule('nodemailer', () => {
    return {
        default: {
        createTransport: () => ({
            sendMail: jest.fn().mockResolvedValue(true)
        })
        }
    };
    });

    // ✅ MOCK db connection
    jest.unstable_mockModule('../database/db.js', () => ({
    default: {
        query: jest.fn()
    }
    }));

    // ✅ Dynamic imports after mocks
    const nodemailer = (await import('nodemailer')).default;
    const pool = (await import('../database/db.js')).default;
    const request = (await import('supertest')).default;
    const express = (await import('express')).default;
    const { forgotPassword } = await import('../controllers/forgotpasswordController.js');

    // ✅ Set up temporary app
    const app = express();
    app.use(express.json());
    app.post('/api/users/forgot-password', forgotPassword);

    // ✅ Begin tests
    describe('Forgot Password Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 for non-Gmail address', async () => {
        const res = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'user@yahoo.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Valid Gmail address is required');
    });

    it('should return 200 even if user not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'notfound@gmail.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('If an account exists, a reset link has been sent');
    });

    it('should update DB and send email if user exists', async () => {
        // Setup .env vars
        process.env.EMAIL_USER = 'test@gmail.com';
        process.env.EMAIL_PASS = 'app-password';

        // Step 1: Find user
        pool.query
        .mockResolvedValueOnce({
            rows: [{
            user_id: 1,
            name: 'Mock User',
            email: 'mockuser@gmail.com'
            }]
        })
        // Step 2: Update token
        .mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'mockuser@gmail.com' });

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM mobex_users WHERE email = $1',
        ['mockuser@gmail.com']
        );
        expect(pool.query).toHaveBeenCalledWith(
        'UPDATE mobex_users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
        [expect.any(String), expect.any(Date), 'mockuser@gmail.com']
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Reset link has been sent to your Gmail address');
    });

    it('should return 500 if EMAIL_USER or EMAIL_PASS is missing', async () => {
        delete process.env.EMAIL_USER;
        delete process.env.EMAIL_PASS;

        pool.query.mockResolvedValueOnce({
        rows: [{
            user_id: 1,
            name: 'Mock User',
            email: 'mockuser@gmail.com'
        }]
        });

        const res = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'mockuser@gmail.com' });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Email configuration missing in environment');
    });
    });
