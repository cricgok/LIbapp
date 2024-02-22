const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 5001;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gokul@123',
  database: 'library'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Route to handle form submission to add a new book
app.post('/submit-form', (req, res) => {
  const { title, author, subject, publishDate, count } = req.body;
  const query = `INSERT INTO books (title, author, subject, publish_date, count) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [title, author, subject, publishDate, count], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(200).json({ message: 'Book added successfully' });
  });
});

// Route to fetch books with optional search filters and pagination
app.get('/books', (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  let query = `SELECT * FROM books WHERE title LIKE '%${search}%' OR author LIKE '%${search}%' OR subject LIKE '%${search}%' OR publish_date LIKE '%${search}%' LIMIT ?, ?`;
  
  connection.query(query, [offset, limit], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

// Route to delete a book by ID
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const query = `DELETE FROM books WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

// Route to fetch the total count of books
app.get('/books/count', (req, res) => {
  connection.query('SELECT COUNT(*) AS totalBooks FROM books', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const totalBooksCount = results[0].totalBooks;
    res.json({ count: totalBooksCount });
  });
});

app.post('/borrowers', (req, res) => {
  const { bookId, borrowerData } = req.body;

  // SQL query to insert borrower data into the database
  const query = 'INSERT INTO borrowers (book_id, name, email, phone_number, address) VALUES (?, ?, ?, ?, ?)';
  const values = [bookId, borrowerData.name, borrowerData.email, borrowerData.phoneNumber, borrowerData.address];

  // Execute the query
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting borrower data:', error);
      return res.status(500).json({ error: 'Failed to store borrower data' });
    }

    res.status(200).json({ message: 'Borrower data stored successfully' });
  });
});


// Route to handle borrowing a book
app.post('/books/:id/borrow', async (req, res) => {
  const bookId = req.params.id;
  const { email, title } = req.body;

  // Update the count of the book in the database
  connection.query('UPDATE books SET count = count - 1 WHERE id = ?', [bookId], async (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    // Send email notification
    try {
      await sendEmail(email, title);
      res.status(200).json({ message: 'Book borrowed successfully and email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Route to fetch the borrowers list
app.get('/borrowers', (req, res) => {
  const query = 'SELECT DISTINCT name, phone_number AS phoneNumber, email, address FROM borrowers';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});


// Route to handle sending emails
app.post('/send-email', (req, res) => {
  const { email, bookTitle } = req.body;

  // Send email notification
  sendEmail(email, bookTitle)
    .then(() => {
      res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch(error => {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email notification' });
    });
});



// Function to send email
const sendEmail = async (toEmail, bookTitle) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gokulramesh033@gmail.com', // Enter your Gmail email address
      pass: 'nzig mhrd mtvw vmrn' // Enter your Gmail password
    }
  });

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'gokulramesh@gmail.com', // Enter your Gmail email address
      to: toEmail,
      subject: 'Book Borrowed Notification',
      text: `You have borrowed the book: ${bookTitle}. Enjoy reading!`
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
