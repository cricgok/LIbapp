import React, { useState, useEffect } from 'react';
import './LibraryList.css'; // Import CSS file for styling
import Counters from './Counters'; // Import the Counters component

function LibraryList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [totalBooksCount, setTotalBooksCount] = useState(0); // State to store the total count of books

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

    // Fetch total count of books from the server
    fetch(`http://localhost:5001/books/count`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch total books count');
        }
        return response.json();
      })
      .then(data => setTotalBooksCount(data.count))
      .catch(error => console.error('Error fetching total books count:', error));
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setSearchSubject('');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Function to handle borrowing a book
  const handleGetBook = (bookId) => {
    // Send a request to decrement the count of the selected book
    fetch(`http://localhost:5001/books/${bookId}/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'borrow' }), // Optionally, you can send additional data
    })
    .then(response => {
      if (response.ok) {
        // If borrowing is successful, update the count of the selected book in the state
        const updatedBooks = books.map(book => {
          if (book.id === bookId) {
            return { ...book, count: book.count - 1 }; // Decrement the count by one
          }
          return book;
        });
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks); // Update the filtered books as well
        // You may also want to display a success message to the user
        alert(`Book with ID ${bookId} borrowed successfully!`);
      } else {
        // Handle non-successful response (e.g., 404 Not Found)
        throw new Error('Failed to borrow book');
      }
    })
    .catch(error => {
      console.error('Error borrowing book:', error.message);
      // Display an error message to the user
      alert('Failed to borrow book. Please try again later.');
    });
  };


  // Logic for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="library-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={event => setSearchTitle(event.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={event => setSearchAuthor(event.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchSubject}
          onChange={event => setSearchSubject(event.target.value)}
          className="search-input"
        />
        <button onClick={handleClearFilters} className="filter-button">Clear</button>
        <select value={sortBy} onChange={handleSortChange} className="sort-select">
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="subject">Sort by Subject</option>
        </select>
      </div>
      <p>Total Books: {totalBooksCount}</p> {/* Display total books count */}
      <table className="library-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Count</th> {/* New column for displaying book count */}
            <th>Action</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {currentBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.subject}</td>
              <td>{book.count}</td> {/* Display the count of available books */}
              <td>
                <button onClick={() => handleGetBook(book.id)} className="get-button">Get</button>
              </td>
              {/* Add more table cells for additional book properties */}
            </tr>
          ))}
        </tbody>
      </table>
      <Counters books={filteredBooks} /> {/* Include the Counters component */}
      {/* Pagination */}
      <ul className="pagination">
        {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button onClick={() => paginate(i + 1)} className="page-link">
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LibraryList;
