import React, { useState, useEffect } from 'react';

import { RiDeleteBin7Line } from "react-icons/ri";
import axios from 'axios';

const Selected = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const results = await Promise.all(users.map(async (user) => {
                    const response = await fetch(`http://localhost:5000/result/${user.email}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    return { email: user.email, result: result.result };
                }));

                setUsers(prevUsers => prevUsers.map(user => {
                    const result = results.find(r => r.email === user.email);
                    return { ...user, result: result ? result.result : 'No result available' };
                }));
            } catch (error) {
                console.error('Error fetching the results:', error);
            }
        };

        if (users.length > 0) {
            fetchResults();
        }
    }, [users]);

    const delete_user = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete/${id}`);
            setMessage(response.data.message);
            setUsers(users.filter(user => user.id !== id)); 
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='list'>
            <div className='listuser'>
                {users.filter(user => user.result === 'Selected' ).map((user) => (
                    <div key={user.email} className='user-card'>
                        <p className='show_username'>{user.username}</p>
                        <p className='show_email'>{user.email}</p>
                        <p className='show_role'>{user.role}</p>
                        <p className='show_result'>{user.result}</p>
                        <a href={`http://localhost:5000/admin/getFile/${user.email}`} target="_blank" rel="noopener noreferrer">View File</a>
                        <p className='delete_user' onClick={() => delete_user(user.id)}><RiDeleteBin7Line /></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Selected;
