import React from "react";
import './404.css';

//Functional Component 
const NotFoundPage = () => {
  return (
    <div className="error_div">
      <h1 className="error_title">404</h1>
      <h2 className="error_tagline">whatever you were looking for isn't here...try again next time.</h2>
    </div>
  );
};

export default NotFoundPage;