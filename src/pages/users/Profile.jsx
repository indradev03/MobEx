import React from 'react';

const Profile = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {name || 'Guest'}</p>
      <p><strong>Email:</strong> {email || 'N/A'}</p>
      <p><strong>Role:</strong> {role || 'User'}</p>
    </div>
  );
};

export default Profile;
