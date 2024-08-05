import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Job_filter from "./components/Job_filter";
import Login from "./components/Login";
import Register from "./components/Register";
import User from "./components/User";
import Listuser from "./components/Listuser";
import Requirement from "./components/Requirement";
import User_files from "./components/User_files";
import Nav from "./components/Nav";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<User />} />
          <Route path="/admin/requirements" element={<Requirement />} />
          <Route path="/admin/listuser" element={<Listuser />} />
          <Route path="/admin/jobfilter" element={<Job_filter />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
