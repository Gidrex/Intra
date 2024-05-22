const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("
  	CREATE TABLE users (
  	id INTEGER PRIMARY KEY AUTOINCREMENT,
  	username TEXT,
  	email TEXT,
  	password TEXT)");
});

module.exports = db;
