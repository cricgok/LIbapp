const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5001;

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

// Route to handle form submission
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
// Route to handle borrowing a book
app.post('/books/:id/borrow', (req, res) => {
  const bookId = req.params.id;

  // Perform necessary actions to borrow the book with the given ID
  // For example, you can decrement the count of the book in the database

  // Here, you can update the count of the book in the database or perform any other necessary actions
  // For demonstration purposes, let's assume the book count is decremented by 1
  connection.query('UPDATE books SET count = count - 1 WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book borrowed successfully' });
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
