import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import "./Nav.css";
import UserContext from "../Usercontext";
import { FaRegCircleUser } from "react-icons/fa6";
import { TiThMenuOutline } from "react-icons/ti";
import { MdVerified } from "react-icons/md";

function Nav() {
  const { user, setUser, logout } = useContext(UserContext); // Use context here
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuopen, setIsMenuopen] = useState(false);

  const admindropdown = () => setIsMenuopen(!isMenuopen);
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
        <Link to='/'><MdLogout /></Link>
        
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
