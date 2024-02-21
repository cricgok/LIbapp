// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Route
import HomePage from './Home';
import LoginPage from './Login';
import UserPage from './User';
import Library from './LibraryPage';
import BookListPage from './BookList';


function App() {
  return (
    
      <Routes>
        <Route path="/" exact element={<HomePage />} /> {/* Use Route component and specify the element prop */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/books" element={<BookListPage />} />
      </Routes>
  );
}

export default App;
