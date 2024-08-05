import React, {  useState,useContext, } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import "./Nav.css";
import UserContext from "../Usercontext";
import { FaRegCircleUser } from "react-icons/fa6";
import { TiThMenuOutline } from "react-icons/ti";
import { MdVerified } from "react-icons/md";

function Nav() {
  const navigate = useNavigate();
  const { user,setuser} = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuopen, setIsmenuopen] = useState(false);
  

  const logout = async () => {
    try {
      // Send logout request to the server
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);  
        setuser(null); 
        navigate('/'); 
      } else {
        console.log('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  const admindropdown = () => setIsmenuopen(!isMenuopen);
  const Dropdown = () => setIsOpen(!isOpen);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
          <IoBriefcaseOutline />
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div className="login-btn">
        <Link to="/login" className="button-link">Log In</Link>
      </div>
      {user ? (
  user.role === 'user' ? (
    <div className="admin-menu" onClick={admindropdown}>
      <TiThMenuOutline />
      {isMenuopen && (
        <div className="admin-dropdown-menu">
          <p className="admin-dropdown-text"><Link to='/admin/listuser'>List User</Link></p>
          <p className="admin-dropdown-text"><Link to='/admin/requirements'>Requirement</Link></p> 
          <p className="admin-dropdown-text"><Link to='/admin/jobFilter'>Selected</Link></p>      
        </div>
      )}
    </div>
  ) : null 
) : null} 

      <div className="logout" onClick={logout}>
        <MdLogout />
      </div>
      <div className="user-profile" onMouseEnter={Dropdown} onMouseLeave={Dropdown}>
        <FaUserAlt />
        {isOpen && user && (
          <div className="dropdown-menu">
            <p className="dropdown-text"><FaRegCircleUser /> {user.username} </p>        
            <p className="dropdown-text"><MdVerified /> {user.role}</p>
          </div>
        )}
      </div>
      <div className="navbar-divider"></div>
    </div>
    
  );
}

export default Nav;
