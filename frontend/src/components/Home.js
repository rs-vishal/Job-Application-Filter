import React, { useContext } from "react";
import UserContext from "../Usercontext";
import "./home.css";
function Home() {
  const { user } = useContext(UserContext);
  return (
    <div>
      <div className="home">
      <div>
      {user === null ? (
        <p>Loading...</p>
      ) : user ? (
        <p>User is logged in</p>
        
      ) : (
        <p>User is logged out</p>
      )}
      </div>
      </div>
    </div>
  );
}

export default Home;
