import React, { useContext, useEffect } from "react";
import UserContext from "../Usercontext";
import "./home.css";
import Upload from "./Upload";
import { useNavigate } from "react-router";

function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      {user && (
        <div>
          <div className="home"> Welcome ! .. {user.username}</div>
          <Upload />
        </div>
      )}
    </div>
  );
}

export default Home;
