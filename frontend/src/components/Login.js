import React, { useState ,useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../Usercontext';
import './login.css';  // Import the CSS file

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
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
          console.log(data.error);
        }
      } catch (error) {
        console.log('Something went wrong. Please try again.');
      }
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h3 className="login-title">Login</h3>
                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="email" className="login-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="login-input"
                    />
                    <label htmlFor="password" className="login-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="login-input"
                    />
                    <button
                        type="submit"
                        className="login-button"
                    >
                        Log In
                    </button>
                    <div className="register-link-container">
                    <Link to="/register">Register Now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
