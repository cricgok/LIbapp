import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
// import image1 from './assesst/image1.jpg';
// import image2 from './assesst/image2.jpg';
import image3 from './assesst/image3.jpg';
// import image4 from './assesst/image4.jpg';


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
      <div className="image-container">
        <img src={image3} alt="Image 3" className="image" />
        
        {/* Add more images as needed */}
      </div>
    </div>
  );
}

export default Home;
