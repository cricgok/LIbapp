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
  const totalBooks = books.length;

  return (
    <div className="counter-container">
      <table className="counters-table">
        <thead>
          <tr>
            <th>BOOKS</th>
            <th>Authors</th>
            <th>Subjects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalBooks}</td>
            <td>{Object.keys(authorCount).length}</td>
            <td>{Object.keys(subjectCount).length}</td>
          </tr>
        </tbody>
      </table>
  
      <div className="counter total-count">
        <span>Total Books: {totalBooks}</span>
      </div>
    </div>
  );
}

export default Counters;
