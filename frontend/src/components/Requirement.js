import React, { useState } from 'react';
import axios from 'axios';
import './requirement.css'

function Requirement() {
    const [RequirementData, setRequirementData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddRequirements = () => {
        if (inputValue.trim()) {
            setRequirementData([...RequirementData, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            
            const result = await axios.post('http://localhost:5000/admin/requirements', { requirements: RequirementData });
            setResponse(result.data);
            setRequirementData([]); 
        } catch (error) {
            console.error('There was an error!', error);
            setError(error.response ? error.response.data : { error: 'Unknown error' });
            setResponse(null);
        }
    };

    return (
        <div className='requirement'>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    placeholder="Enter item" 
                />
                <button type="button" onClick={handleAddRequirements}>Add Requirement</button>
                <button type="submit">Submit Array Data</button>
            </form>
            <ul>
                {RequirementData.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            {response && <div>Response: {JSON.stringify(response)}</div>}
            {error && <div style={{ color: 'red' }}>Error: {JSON.stringify(error)}</div>}
        </div>
    );
}

export default Requirement;
