import React, { useState, useEffect } from 'react';
import './LibraryList.css'; // Import CSS file for styling

function LibraryList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchBooks();
  }, []); // Fetch books only once when the component mounts

  useEffect(() => {
    // Filter books based on the search terms
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      book.author.toLowerCase().includes(searchAuthor.toLowerCase()) &&
      book.subject.toLowerCase().includes(searchSubject.toLowerCase())
    );

    // Sort filtered books based on the selected sorting criteria
    switch (sortBy) {
      case 'title':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filtered = filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'subject':
        filtered = filtered.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      default:
        break;
    }

    setFilteredBooks(filtered);
  }, [books, searchTitle, searchAuthor, searchSubject, sortBy]);

  const fetchBooks = () => {
    fetch(`http://localhost:5001/books`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        setFilteredBooks(data); // Initially set filtered books to all books
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setSearchSubject('');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={event => setSearchTitle(event.target.value)}
        />
        <input
          type="text"
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={event => setSearchAuthor(event.target.value)}
        />
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchSubject}
          onChange={event => setSearchSubject(event.target.value)}
        />
        <button onClick={handleClearFilters}>Clear</button>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="subject">Sort by Subject</option>
        </select>
      </div>
      <table className="library-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.subject}</td>
              {/* Add more table cells for additional book properties */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LibraryList;
