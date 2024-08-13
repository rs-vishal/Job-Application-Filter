import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { username: '', email: '', role: '', id: '' };
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/session', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
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
      
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
