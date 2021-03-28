import React from "react";
import { Link } from "react-router-dom";

//Functional Component 
const MainPage = () => {
  return (
    <div>
      <h1>nAME DROP??</h1>
      <h2>Converse confidently.</h2>
      <Link to="/users">Show List of Users</Link>
    </div>
  );
};

export default MainPage;