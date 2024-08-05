import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../Usercontext';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        navigate('/');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="home">
      <div className="container">
        <p className="text">Welcome Back</p>
        <p className="text2">Enter your data to sign in to your account</p>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="textbox">
            <label htmlFor="username">Email:</label><br />
            <input
              type="email"
              name="username"
              placeholder="e.g. username@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br />
            <label htmlFor="password">Password:</label><br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br />
          </div>
          <div>
            <button className="button" type="submit">Continue</button>
          </div>
        </form>
        <div id="register_now">
          <p>Don't have an account? <Link to="/register">Register Now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
