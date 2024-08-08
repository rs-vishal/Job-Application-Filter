import React, { useEffect, useState } from 'react';

function Userfiles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/files-with-users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Files with User Details</h1>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            <h2>File: {item.filename}</h2>
            {item.user_details ? (
              <div>
                <p>User Email: {item.user_details.email}</p>
                <p>User Name: {item.user_details.name}</p>
                {/* Add other user details here */}
              </div>
            ) : (
              <p>No user details available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Userfiles;
