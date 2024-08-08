import React, { useContext } from "react";
import UserContext from "../Usercontext";
import "./home.css";
import Upload from "./Upload";

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <div >
        {user ? (
          <div>
            <div className="home"> Welcome ! .. {user.username}</div>
            <Upload /> 
          </div>
        ) : (
          <div>
            <p className="warning">Please login to continue..</p>
          </div>
        )}
            
            
            
           
      </div>
      
    </div>
  );
}

export default Home;
