// importing file system and database modules

const fs = require("fs");
const SQL = require("sqlite3");

const Database_Name = "my-database.db";

// deletes database file if it exists
if (fs.existsSync(Database_Name)) {
  fs.unlinkSync(Database_Name);
  console.log(`Deleted existing database file: ${Database_Name}`);
}
// creates a new database
const db = new SQL.Database(Database_Name);

// used code from https://www.npmjs.com/package/sqlite3#usage:
db.serialize(() => {
  // creates the account table with the username and password fields
  db.run(`
    CREATE TABLE account (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL
    );
  `);

  // creates game_data table with character_name and highscore fields
  // we use the character_name as the username
  db.run(`
    CREATE TABLE IF NOT EXISTS game_data (
      gamedata_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      high_score INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES account (user_id) ON DELETE CASCADE
    );
  `);
});

db.close();
