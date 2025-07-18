import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!gmailRegex.test(email)) {
      setError('Only Gmail addresses are allowed');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setMessage(data.message);
        setEmail('');
        // Optional: redirect after a few seconds
        // setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Server error. Please try again later.');
    }
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
          placeholder="Enter your Gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>
      </form>

      <div className="forgetpassword-links">
        <p>
          Remember your password? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
