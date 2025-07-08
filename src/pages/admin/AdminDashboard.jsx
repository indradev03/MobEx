import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');

  useEffect(() => {
    if (!token || userType !== 'admin') {
      navigate('/'); // redirect to login if not admin
    }
  }, [navigate, token, userType]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <div className="admin-dashboard">
      <h1>👋 Welcome, Admin!</h1>
      <p>Name: <strong>{name}</strong></p>
      <p>Email: <strong>{email}</strong></p>

      <div className="admin-actions">
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
