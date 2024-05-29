const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2');
const db = new sqlite3.Database('./sqlite.db');

// Initialize the database and create the users table if it doesn't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)");
});

// Function to hash a password
async function hashPassword(password) {
  try {
    return await argon2.hash(password);
  } catch (err) {
    throw new Error('Password hashing failed');
  }
}

// Function to check a password against a hash
async function checkPassword(password, hash) {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
}

// Function to register a new user
async function registerUser(username, email, password, callback) {
  try {
    const hashedPassword = await hashPassword(password);
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run(username, email, hashedPassword, function (err) {
      callback(err, this.lastID);
    });
    stmt.finalize();
  } catch (err) {
    callback(err, null);
  }
}

// Function to get a user by email
function getUserByEmail(email, callback) {
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    callback(err, row);
  });
}

// Export the functions and database connection
module.exports = { db, registerUser, getUserByEmail, checkPassword };
