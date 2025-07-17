import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '../database/db.js'; // Adjust if needed

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Valid Gmail address is required' });
    }

    const userRes = await pool.query('SELECT * FROM mobex_users WHERE email = $1', [email]);
    console.log('User query result:', userRes.rows);

    if (userRes.rows.length === 0) {
      return res.status(200).json({ message: 'If an account exists, a reset link has been sent' });
    }

    const user = userRes.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE mobex_users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [resetToken, expiresAt, email]
    );
    console.log('Reset token saved to DB');

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

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
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset email sent');

    res.status(200).json({ message: 'Reset link has been sent to your Gmail address' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
