// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <div className="container">
      <h1>Welcome to Library Management System</h1>
      <p>Please login to access the library.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default Home;
