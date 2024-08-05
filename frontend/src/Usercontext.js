import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/session', {
          method: 'GET',
          credentials: 'include' // Ensure cookies are sent
        });
        const data = await response.json();
        if (response.ok) {
          setUser({
            username: data.username,
            email: data.email,
            role: data.role
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
