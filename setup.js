const SQL = require("sqlite3"); //import sqlite3 import Java.util.Database
const fs = require("fs"); // import FileSystem

const Database_Name = "my-database.db";

//deletes file if it exists
if (fs.existsSync(Database_Name)) {
  fs.unlinkSync(Database_Name);
  console.log(`Deleted existing database file: ${Database_Name}`);
}
// creates a new database
const db = new SQL.Database(Database_Name);

// //interact with the database
db.serialize(() => {
  // TODO: Remove eventually
  db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INT)");

  db.run(`
    CREATE TABLE account (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL
    );
  `);

  // should be changed to only hold display name and high score.
  db.run(`
    CREATE TABLE IF NOT EXISTS game_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_name TEXT,
      high_score INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES account (id) ON DELETE CASCADE
    );
  `);
});

db.close();
