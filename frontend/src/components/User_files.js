import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User_file = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getFiles');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Error fetching files');
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Uploaded Files</h1>
      {error && <div>{error}</div>}
      <ul>
        {files.map((file) => (
          <li key={file.file_id}>
            <strong>Filename:</strong> {file.filename} <br />
            <a href={`http://localhost:5000/admin/getFile/${file.file_id}`} target="_blank" rel="noopener noreferrer">View File</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User_file;
