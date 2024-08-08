import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud } from "react-icons/fi";
import './upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      setMessage('File uploaded successfully');
    } catch (error) {
      setMessage('File upload failed');
    }
  };

  return (
    <div>
      <p className='heading'>Upload</p>
      <p className='text'>PDF, DOCS . Max 10MB each</p>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='icons'><FiUploadCloud /></div>
          <div className='textbox'>
          <input
            type='text'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your Email'
            className='textbox'
            value={email}
          />
          </div>
          <div className="file-input-container">
            <label className="custom-file-label" htmlFor="file">
              Choose File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className='button'
            />
            {file && <span className="file-name">{file.name}</span>}
          </div>
          <button type="submit" className='upload-btn'>Upload File</button>
        </form>
      </div >
      <div className='result'>
      {message && <p className='message'>{message} Wait for Results</p>}
      </div>
    </div>
  );
};

export default Upload;
