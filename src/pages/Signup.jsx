import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    const contactRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Individual field validations
    if (!name.trim()) {
      const errMsg = 'Name is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!email.trim()) {
      const errMsg = 'Email is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!gmailRegex.test(email)) {
      const errMsg = 'invalid email format';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!contact.trim()) {
      const errMsg = 'Contact number is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!contactRegex.test(contact)) {
      const errMsg = 'Invalid contact number format';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!address.trim()) {
      const errMsg = 'Address is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!gender.trim()) {
      const errMsg = 'Gender is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!password) {
      const errMsg = 'Password is required';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!passwordRegex.test(password)) {
      const errMsg = 'Invalid password format';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errMsg = 'Passwords do not match';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          contact,
          address,
          gender,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.error || 'Signup failed';
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errMsg = 'Something went wrong. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="signup-container">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSignup} className="signup-form">
          <div className="signup-grid">
            <div className="left-column">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Contact Number</label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />

              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="right-column">
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </div>

              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                  tabIndex={0}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">Sign Up</button>
            <div className="signup-links">
              <p>
                Already have an account? <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
