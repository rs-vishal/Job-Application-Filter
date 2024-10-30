import React from 'react';
import './error.css'
import { Link } from 'react-router-dom';
const Error = () => {
  return (
    <div className='cr'>
    <div className="error-page">
      <h1>404 Bad Request</h1>
      <p>The request cannot be fulfilled due to bad syntax.</p>
      <Link to="/" >Go to Home</Link>

    </div>
    </div>
  );
};

export default Error;