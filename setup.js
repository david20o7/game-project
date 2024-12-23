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
  db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INT)");

  // adding examples
});

db.close();
