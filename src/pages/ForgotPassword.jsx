import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      setMessage('');
      return;
    }

    // Placeholder for real API call to send reset email
    setError('');
    setMessage(`If an account with ${email} exists, a password reset link has been sent.`);

    // Optional: redirect after some time
    // setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>
      </form>
      <div className='forgetpassword-links'>
        <p>
          Remember your password? <a href="/login">Login here</a>
        </p>
      </div>

    </div>
  );
};

export default ForgotPassword;
