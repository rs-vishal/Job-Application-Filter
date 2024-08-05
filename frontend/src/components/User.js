import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 403) {
            setError('Access forbidden: You do not have permission to view this data.');
          } else if (error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError('Error fetching users');
          }
        } else {
          setError('Error fetching users');
        }
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError('You need to be logged in to view this page.');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="users-list">
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
