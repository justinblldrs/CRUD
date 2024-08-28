const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Setup middleware
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create a table (if it doesn't exist)
db.query(`CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
)`, (err) => {
  if (err) throw err;
});

// Create
app.post('/items', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO items (name) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, name });
  });
});

// Read
// Read
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Error fetching items:', err); // Log error
      return res.status(500).send('Error fetching items');
    }
    res.json(results);
  });
});


// Update
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE items SET name = ? WHERE id = ?';
  db.query(query, [name, id], (err) => {
    if (err) throw err;
    res.json({ id, name });
  });
});

// Delete
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM items WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.status(204).end();
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
