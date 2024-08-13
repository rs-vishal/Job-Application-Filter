import React, { useState } from "react";
import axios from "axios";
import "./requirement.css";
import { IoMdAddCircle } from "react-icons/io";
import { BsUpload } from "react-icons/bs";

function Requirement() {
  const [requirementData, setRequirementData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddRequirements = () => {
    if (inputValue.trim()) {
      setRequirementData([...requirementData, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/requirements", {
        requirements: requirementData,
      });
      setRequirementData([]);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="requirement">
      <form onSubmit={handleSubmit}>
        <div className="textbox">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter item"
          />
          <button
            type="button"
            onClick={handleAddRequirements}
            aria-label="Add requirement"
            className="add-button"
          >
            <IoMdAddCircle />
          </button>
          <button
            type="submit"
            aria-label="Submit requirements"
            className="submit-button"
          >
            <BsUpload />
          </button>
        </div>
      </form>
      <div className="requirements-list">
        <ul>
          {requirementData.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Requirement;
