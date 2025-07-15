import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

// === Signup Controller ===
export const signup = async (req, res) => {
  let { name, email, contact, address, gender, password, role } = req.body;

  if (!name || !email || !contact || !address || !gender || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Normalize email to lowercase
  email = email.toLowerCase();

  // Default role to 'user' if not provided or invalid
  const userRole = role && typeof role === 'string' ? role.toLowerCase() : 'user';

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
    // Unique violation code in PostgreSQL
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// === Login Controller ===
export const login = async (req, res) => {
  let { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please fill in all fields including role' });
  }

  email = email.toLowerCase();
  role = role.toLowerCase();

  try {
    const result = await pool.query(
      'SELECT user_id, name, email, password, role FROM mobex_users WHERE email = $1 AND role = $2',
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
