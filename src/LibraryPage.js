import React, { useState, useEffect } from 'react';
import LibraryList from './LibraryList';
import Pagination from './Pagination'; // Import Pagination component
import './LibraryPage.css';

function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = () => {
    const pageSize = 10; // Define the number of books per page
    const startIndex = (currentPage - 1) * pageSize;
    fetch(`http://localhost:5001/books?_start=${startIndex}&_limit=${pageSize}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        // Calculate total pages based on total number of books
        fetch('http://localhost:5001/books/count')
          .then(response => response.json())
          .then(totalBooks => {
            const totalPages = Math.ceil(totalBooks / pageSize);
            setTotalPages(totalPages);
          })
          .catch(error => console.error('Error fetching total book count:', error));
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Library Management System</h1>
      <LibraryList books={books} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default LibraryPage;
