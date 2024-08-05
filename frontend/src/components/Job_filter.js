import React, { useState } from 'react';
import axios from 'axios';

const JobFilter = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    axios.post('http://localhost:5000/upload', formData)
      .then(response => {
        setMessage('File uploaded successfully');
      })
      .catch(error => {
        setMessage('File upload failed');
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' onChange={(e) => setEmail(e.target.value)} placeholder='Enter your Email'/>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default JobFilter;
