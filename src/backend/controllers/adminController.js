import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js'; // Your PostgreSQL connection

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM mobex_admin WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or username' });
    }

    // ⚠️ Direct password check — replace with bcrypt in production!
    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin.admin_id,
        username: admin.username,
        role: "admin" // ✅ this must be included
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

/**
 * Get admin by email
 */
export const getAdminByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      'SELECT admin_id, username, email FROM mobex_admin WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching admin by email:', err);
    res.status(500).json({ message: 'Error fetching admin', error: err.message });
  }
};

/**
 * Get all admins
 */
export const getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT admin_id, username, email FROM mobex_admin ORDER BY admin_id ASC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching all admins:', err);
    res.status(500).json({ message: 'Error fetching admins', error: err.message });
  }
};

