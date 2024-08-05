import React, { useState, useEffect } from 'react';
import './listuser.css'

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setUsers(data);
                } else {
                    setError(data.msg || 'Error fetching users');
                }
            } catch (error) {
                setError('Error fetching users');
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='listuser'>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} - {user.email}
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListUser;
