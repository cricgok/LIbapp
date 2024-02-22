import React, { useState, useEffect } from 'react';
import './BookList.css'; 
import './LibraryPage.css';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import Bookimage from './assesst/booklist.jpg';

function BookList({ onDeleteBook }) {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = () => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    fetch(`http://localhost:5001/books?_start=${startIndex}&_limit=${itemsPerPage}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        // Calculate total pages based on total number of books
        fetchTotalBooksCount();
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  const fetchTotalBooksCount = () => {
    fetch(`http://localhost:5001/books/count`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch total books count');
        }
        return response.json();
      })
      .then(data => {
        // Calculate total pages based on total number of books
        const totalPages = Math.ceil(data.count / 10); // Assuming 10 items per page
        setTotalPages(totalPages);
      })
      .catch(error => console.error('Error fetching total books count:', error));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="book-list-container">
      <img src={Bookimage} alt="BookImage" className='booklist-image'/>
      <h2>Book List</h2>
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Publish Date</th>
            <th>Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} className="book-item">
              <td className="book-info">{book.title}</td>
              <td className="book-info">{book.author}</td>
              <td className="book-info">{book.subject}</td>
              <td className="book-info">{book.publish_date}</td>
              <td className="book-info">{book.count}</td>
              <td><button className='book-delete' onClick={() => onDeleteBook(book.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <br></br>
      <Link to="/borrowers" className="link">
        <button className="login-button">Borrowers List</button>
      </Link>
    </div>
  );
}

export default BookList;
