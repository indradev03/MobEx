import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // default to 'user'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  if (!email || !password) {
    setError('Please fill in both fields');
    return;
  }

  const loginUrl =
    userType === 'admin'
      ? 'http://localhost:5000/api/admin/login'
      : 'http://localhost:5000/api/users/login';

  const body =
    userType === 'admin'
      ? { emailOrUsername: email, password }
      : { email, password, role: 'user' };


  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      setError(data.error || data.message || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);

    if (userType === 'admin') {
      localStorage.setItem('email', data.admin.email);
      localStorage.setItem('name', data.admin.username);
      localStorage.setItem('userType', 'admin');
      navigate('/admindashboard');
    } else {
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('name', data.user.name);
      localStorage.setItem('userType', 'user');
      navigate('/userdashboard');
    }

    window.dispatchEvent(new Event('login'));
  } catch (err) {
    console.error('Login error:', err);
    setError('Server error. Please try again later.');
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />

        <label>Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <div
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        </div>

        <label>User Type</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>

      <div className="login-links">
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
