import React, { useEffect, useState } from 'react';
import './Profile.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaUpload, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const { user } = await res.json();
      setUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
        gender: user.gender || '',
        role: user.role || '',
      });
      setPreview(null);
      setImageFile(null);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    // Phone number validation (optional field, but if filled must be 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (formData.contact && !phoneRegex.test(formData.contact)) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Update failed');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      console.error(error);
    }
  };


  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        gender: user.gender,
        role: user.role,
      });
    }
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.warn('No image selected to upload');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    const data = new FormData();
    data.append('image', imageFile);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/profile/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }

      toast.success('Profile image uploaded!');
      setImageFile(null);
      setPreview(null);
      fetchProfile();
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (deleting) return;
    setDeleting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in');
      setDeleting(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile/delete-image', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Delete failed');
      }

      toast.success('Profile image deleted');
      fetchProfile();
    } catch (error) {
      toast.error(`Failed to delete image: ${error.message}`);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-image-section">
          <input
            type="file"
            id="profile-file-input"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="profile-file-input"
            className="profile-image-wrapper"
            title="Click to change profile picture"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="profile-image" />
            ) : user.profile_image ? (
              <img
                src={`http://localhost:5000${user.profile_image}`}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">No Image</div>
            )}
            <div className="profile-edit-icon-overlay">
              <FaEdit />
            </div>
          </label>

          <div className="profile-image-action-buttons">
            <button
              className="profile-upload-btn"
              onClick={handleUpload}
              disabled={!imageFile || uploading || deleting}
            >
              <FaUpload style={{ marginRight: 6 }} />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {user.profile_image && !preview && (
              <button
                className="profile-delete-btn"
                onClick={handleDeleteImage}
                disabled={uploading || deleting}
              >
                <FaTrash style={{ marginRight: 6 }} />
                {deleting ? 'Deleting...' : 'Delete Image'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-details">
          {isEditing ? (
            <>
              <label className="profile-label">
                <strong>Name:</strong>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                <strong>Email:</strong>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                <strong>Contact:</strong>
                <input
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                <strong>Address:</strong>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                <strong>Gender:</strong>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="profile-select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="profile-label">
                <strong>Role:</strong>
                <input
                  name="role"
                  type="text"
                  value={formData.role}
                  disabled
                  className="profile-input"
                />
              </label>

              <div className="profile-edit-buttons">
                <button onClick={handleSave} className="profile-save-btn">
                  <FaSave /> Save
                </button>
                <button onClick={handleCancel} className="profile-cancel-btn">
                  <FaTimes /> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-info-row">
                  <span className="profile-info-label">Name:</span>
                  <span className="profile-info-value">{user.name}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Email:</span>
                  <span className="profile-info-value">{user.email}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Contact:</span>
                  <span className="profile-info-value">{user.contact}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Address:</span>
                  <span className="profile-info-value">{user.address}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Gender:</span>
                  <span className="profile-info-value">{user.gender}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Role:</span>
                  <span className="profile-info-value">{user.role}</span>
                </div>
              </div>

              <button
                className="profile-edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit style={{ marginRight: 6 }} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
