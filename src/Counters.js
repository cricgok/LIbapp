import React from 'react';
import './counters.css';

function Counters({ books }) {
  // Initialize counters
  let authorCount = {};
  let subjectCount = {};

  // Check if books array is defined
  if (!Array.isArray(books)) {
    return null; // Return null or handle the case where books is not defined
  }

  // Count occurrences of each author and subject
  books.forEach(book => {
    // Count authors
    authorCount[book.author] = (authorCount[book.author] || 0) + 1;

    // Count subjects
    subjectCount[book.subject] = (subjectCount[book.subject] || 0) + 1;
  });

  // Calculate total number of books
  const totalBooks = books.reduce((total, book) => total + (book.count || 0), 0);

  return (
    <div className="counter-container">
      <h2>Book Statistics</h2>
      <div className="counters-wrapper">
        <div className="counter-box">
          <h3>Total Books</h3>
          <div className="counter-value">{totalBooks}</div>
        </div>
        <div className="counter-box">
          <h3>Total Authors</h3>
          <div className="counter-value">{Object.keys(authorCount).length}</div>
        </div>
        <div className="counter-box">
          <h3>Total Subjects</h3>
          <div className="counter-value">{Object.keys(subjectCount).length}</div>
        </div>
      </div>
    </div>
  );
}

export default Counters;
