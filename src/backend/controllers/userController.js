import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

// === Signup Controller ===
export const signup = async (req, res) => {
  const { name, email, contact, address, gender, password, role } = req.body;

  if (!name || !email || !contact || !address || !gender || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Optional: validate role or set default here if you want
  const userRole = role || 'user';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO mobex_users (name, email, contact, address, gender, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING user_id, name, email, role`,
      [name, email, contact, address, gender, hashedPassword, userRole]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// === Login Controller ===
export const login = async (req, res) => {
  const { email, password, role } = req.body;  // Accept role from frontend

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please fill in all fields including role' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM mobex_users WHERE email = $1 AND role = $2',
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email, password, or role' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email, password, or role' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

