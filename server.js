const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { registerUser, getUserByEmail, checkPassword } = require('./database');

const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies and serve static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'templates')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'reg.html'));
});

// Route for the registration page
app.get('/reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'reg.html'));
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  await registerUser(username, email, password, (err, userId) => {
    if (err) {
      res.send('Registration failed'); // TODO: replace send with a redirect to the login page with notification
    } else {
      res.send('Registration successful');
    }
  });
});

// Route for the login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  getUserByEmail(email, async (err, user) => {
    if (err || !user) {
      res.send('Invalid email or password');
    } else {
      if (await checkPassword(password, user.password)) {
        res.send('Login successful');
      } else {
        res.send('Invalid email or password');
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
