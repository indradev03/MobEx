import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to reset password');
      } else {
        toast.success('Password reset successful!');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch {
      toast.error('Server error. Please try again later.');
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <p className="error">Invalid or expired reset link.</p>
        <ToastContainer position="top-center" autoClose={3000}  />
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button type="submit">Reset Password</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
