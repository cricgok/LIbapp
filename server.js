const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
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

// Middleware
app.use(bodyParser.json());

// Route to handle form submission
app.post('/submit-form', (req, res) => {
  const { title, author, subject, publishDate } = req.body;
  const query = `INSERT INTO books (title, author, subject, publish_date) VALUES (?, ?, ?, ?)`;

  connection.query(query, [title, author, subject, publishDate], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(200).json({ message: 'Book added successfully' });
  });
});

// Add a new route to fetch books
app.get('/books', (req, res) => {
  const { search } = req.query; // Assuming search query parameter is used for filtering
  let query = `SELECT * FROM books`;

  // Add filtering logic if search parameter is provided
  if (search) {
    query += ` WHERE title LIKE '%${search}%' OR author LIKE '%${search}%' OR subject LIKE '%${search}%' OR publish_date LIKE '%${search}%'`;
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});
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


// Express route for fetching paginated books
app.get('/books', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  connection.query('SELECT * FROM books LIMIT ?, ?', [offset, limit], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
