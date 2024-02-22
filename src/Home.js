// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <div className="container">
      <h1 className="heading">Welcome to Library Management System</h1>
      <p className="description">Manage your books, explore new reads, and organize your library with ease.</p>
      <p className="description">Our library system provides a user-friendly interface for browsing, searching, and managing books.</p>
      <p className="description">Please login to access the library.</p>
      <Link to="/login" className="link">
        <button className="login-button">Login</button>
      </Link>
    </div>
  );
}

export default Home;
