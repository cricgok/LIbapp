import React, { useState } from 'react';
import './BorrowerForm.css'; // Import CSS file
import EmailImage from './assesst/email.jpg';

function BorrowerForm({ book, onBorrow }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to store the borrower data
      const response = await fetch('http://localhost:5001/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          borrowerData: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store borrower data');
      }

      // Send email notification
      const emailResponse = await fetch('http://localhost:5001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          bookTitle: book.title,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email notification');
      }

      // Assuming onBorrow is a function passed from LibraryList to handle borrowing
      onBorrow(book.id, formData);

      // Clear the form data after successful submission
      handleClear();
    } catch (error) {
      console.error('Error handling form submission:', error);
      // Handle error, show message to user, etc.
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

  return (
    <div className="borrower-form-container">
      <img src={EmailImage} alt="Form Image" className="borrower-form-image" /> {/* Image element */}
      <h2>Borrow Book: {book.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="form-control" />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default BorrowerForm;
