import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '../database/db.js';

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // === 1. Basic Validation ===
    if (!email || typeof email !== 'string' || !email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Valid Gmail address is required' });
    }

    // === 2. Check if user exists ===
    const result = await pool.query(
      'SELECT user_id, name FROM mobex_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Never reveal whether email exists
      return res.status(200).json({
        message: 'If an account exists, a reset link has been sent'
      });
    }

    const user = result.rows[0];

    // === 3. Generate token and expiry ===
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      'UPDATE mobex_users SET reset_token = $1, reset_token_expires = $2 WHERE user_id = $3',
      [resetToken, expiresAt, user.user_id]
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // === 4. Validate email config ===
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email configuration missing in environment' });
    }

    // === 5. Setup mailer ===
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'Mobex Support <noreply@mobex.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Hello ${user.name},</h3>
        <p>You requested to reset your password. Click below to continue:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 15 minutes. If you didn’t request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Reset link has been sent to your Gmail address'
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
