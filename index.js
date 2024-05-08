const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Set up SQLite database connection
const db = new sqlite3.Database('./users.db');

// Create a table for users if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    token TEXT
  );
`);

// Define a route for login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email ||!password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  // Query the database to find the user
  db.get(`SELECT * FROM users WHERE email =?`, email, (err, row) => {
    if (err) {
      return res.status(500).send({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, row.password, (err, isValid) => {
      if (err) {
        return res.status(500).send({ error: 'Password comparison error' });
      }

      if (!isValid) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }

      // Generate a token for the user
      const token = jwt.sign({ userId: row.id }, 'secretKey', { expiresIn: '1h' });

      // Update the user's token in the database
      db.run(`UPDATE users SET token =? WHERE id =?`, token, row.id);

      // Return the token to the client
      res.send({ token });
    });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
