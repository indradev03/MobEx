import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "./UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user");
      }

      fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.user_id?.toString().includes(value)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>User Management</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading && <div className="loader">Loading users...</div>}
      {error && <div className="error-text">Error: {error}</div>}

      {!loading && !error && (
        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <p className="no-users">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div className="user-card" key={user.user_id}>
                <button
                  className="btn-icon-delete"
                  onClick={() => handleDelete(user.user_id)}
                  title="Delete User"
                >
                  <FaTrashAlt />
                </button>

                <div className="user-avatar">
                  {user.profile_image ? (
                    <img
                      src={`http://localhost:5000${user.profile_image}`}
                      alt={`${user.name}'s profile`}
                    />
                  ) : (
                    <div className="placeholder-avatar">👤</div>
                  )}
                </div>

                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className="user-contact">{user.contact || "No contact info"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
