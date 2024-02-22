import React, { useState, useEffect } from 'react';
import './BookList.css'; 
import './LibraryPage.css';
import Pagination from './Pagination';

function BookList({ onDeleteBook, currentPage, itemsPerPage, onPageChange }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, currentPage, itemsPerPage]);

  const fetchBooks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    fetch(`http://localhost:5001/books?search=${searchTerm}&_start=${startIndex}&_limit=${itemsPerPage}`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/books/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // If deletion is successful, remove the deleted book from the state
        setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      } else {
        // Handle non-successful response (e.g., 404 Not Found)
        throw new Error('Failed to delete book');
      }
    })
    .catch(error => {
      console.error('Error deleting book:', error.message);
      // Display an error message to the user
      alert('Failed to delete book. Please try again later.');
    });
  };

  return (
    <div className="book-list-container">
      <h2>Book List</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, author, subject, or publish date"
        onChange={(e) => handleSearch(e.target.value)}
      />
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
              <td><button className='book-delete' onClick={() => handleDelete(book.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(books.length / itemsPerPage)}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default BookList;
