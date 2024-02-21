// Filters.js
import React from 'react';

function Filters({ handleSearch }) {
  return (
    <div className="filters">
      <input type="text" placeholder="Search..." onChange={handleSearch} />
    </div>
  );
}

export default Filters;
