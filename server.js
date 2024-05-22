const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'templates')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'reg.html'));
});

app.get('/reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'reg.html'));
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(username, email, password, (err) => {
    if (err) {
      res.send('Registration failed');
    } else {
      res.send('Registration successful');
    }
  });
  stmt.finalize();
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) {
      res.send('Login failed');
    } else if (row) {
      res.send('Login successful');
    } else {
      res.send('Invalid email or password');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
