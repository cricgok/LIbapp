import React, { useState, useEffect } from 'react';

function Library() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    subject: '',
    publishDate: ''
  });
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Fetch list of books from backend
    fetchBooks();
  }, []);
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    // Apply filters whenever they change
    applyFilters();
  }, [filters]);
  

  const fetchBooks = () => {
    fetch('http://localhost:5001/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        // Initially set filtered books to all books
        setFilteredBooks(data);
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  const applyFilters = () => {
    let filteredResult = books.filter(book => {
      const { title = '', author = '', subject = '', publishDate = '' } = filters;
      // Ensure that book object exists and has the required properties
      if (!book) return false;
      return (
        book.title.toLowerCase().includes(title.toLowerCase()) &&
        book.author.toLowerCase().includes(author.toLowerCase()) &&
        book.subject.toLowerCase().includes(subject.toLowerCase()) &&
        book.publishDate.toLowerCase().includes(publishDate.toLowerCase())
      );
    });
    setFilteredBooks(filteredResult);
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <h2>Library</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={filters.title} onChange={handleFilterChange} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input type="text" id="author" name="author" value={filters.author} onChange={handleFilterChange} />
      </div>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" name="subject" value={filters.subject} onChange={handleFilterChange} />
      </div>
      <div>
        <label htmlFor="publishDate">Publish Date:</label>
        <input type="text" id="publishDate" name="publishDate" value={filters.publishDate} onChange={handleFilterChange} />
      </div>
      <p>Total books: {filteredBooks.length}</p>
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Subject: {book.subject}</p>
            <p>Publish Date: {book.publishDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default Library;
