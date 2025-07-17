import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

// === Signup Controller ===

export const signup = async (req, res) => {
  let { name, email, contact, address, gender, password, role } = req.body;

  // Normalize email
  if (email) email = email.toLowerCase();

  // === VALIDATIONS ===

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Gmail-only format validation
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(email)) {
    return res.status(400).json({ error: 'Only Gmail addresses are allowed' });
  }

  if (!contact || contact.trim() === '') {
    return res.status(400).json({ error: 'Contact number is required' });
  }

  const contactRegex = /^\d{10}$/;
  if (!contactRegex.test(contact)) {
    return res.status(400).json({ error: 'Contact number must be exactly 10 digits' });
  }

  if (!address || address.trim() === '') {
    return res.status(400).json({ error: 'Address is required' });
  }

  if (!gender || gender.trim() === '') {
    return res.status(400).json({ error: 'Gender is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ error: 'Password is required' });
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and include at least one number and one special character',
    });
  }

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

  // Normalize
  email = email?.toLowerCase();
  role = role?.toLowerCase();

  // === VALIDATIONS ===
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please fill in all fields including role' });
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(email)) {
    return res.status(400).json({ error: 'Only Gmail addresses are allowed' });
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and include at least one number and one special character',
    });
  }

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

export const uploadProfileImage = async (req, res) => {
  const userId = req.user?.userId;

  const imageFile = req.files?.image?.[0]; // Access "image" field

  if (!imageFile) {
    return res.status(400).json({ error: 'No profile image uploaded' });
  }

  const imageUrl = `/uploads/${imageFile.filename}`;

  try {
    await pool.query(
      'UPDATE mobex_users SET profile_image = $1 WHERE user_id = $2',
      [imageUrl, userId]
    );

    res.json({ message: 'Profile image uploaded', imageUrl });
  } catch (err) {
    console.error('Error saving profile image:', err);
    res.status(500).json({ error: 'Failed to update image' });
  }
};

export const deleteProfileImage = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'UPDATE mobex_users SET profile_image = NULL WHERE user_id = $1 RETURNING *',
      [userId]
    );
    res.json({ message: 'Image removed' });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Failed to delete profile image' });
  }
};


export const getUserProfile = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT user_id, name, email, contact, address, gender, role, profile_image
       FROM mobex_users
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};




// You must extract userId from req.user (set by your authenticateToken middleware)
export const updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { name, email, contact, address, gender } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Phone number validation: exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (contact && !phoneRegex.test(contact)) {
    return res.status(400).json({ error: 'Contact number must be exactly 10 digits' });
  }

  try {
    // Check if email already exists for another user
    const emailCheckQuery = 'SELECT user_id FROM mobex_users WHERE email = $1 AND user_id != $2';
    const emailCheckResult = await pool.query(emailCheckQuery, [email.toLowerCase(), userId]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Update profile
    const updateQuery = `
      UPDATE mobex_users
      SET name = $1,
          email = $2,
          contact = $3,
          address = $4,
          gender = $5
      WHERE user_id = $6
      RETURNING user_id, name, email, contact, address, gender, role, profile_image
    `;
    const values = [name, email.toLowerCase(), contact, address, gender, userId];
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// controllers/userController.js (or similar)

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, email, contact, address, gender, role, profile_image 
       FROM mobex_users ORDER BY user_id DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Fetch all users error:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};


export const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete the user with the given ID
    const result = await pool.query(
      'DELETE FROM mobex_users WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error deleting user' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    // Find the user with matching reset token
    const result = await pool.query(
      'SELECT * FROM mobex_users WHERE reset_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = result.rows[0];

    // Check if token expired
    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and remove reset token
    await pool.query(
      `UPDATE mobex_users
       SET password = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE user_id = $2`,
      [hashedPassword, user.user_id]
    );

    return res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

