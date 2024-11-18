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
  db.run("CREATE TABLE user (id INT, name TEXT)");

  db.run("INSERT INTO user (id,name) Values(1, 'Bobby bobbyson')");
  db.run("INSERT INTO user (id,name) Values(2, 'William Williamson')");
  db.run("INSERT INTO user (id,name) Values(3, 'Steevie Steevieson')");

  //run a query where we want to process the output
  db.all("SELECT * FROM user", (error, rows) => {
    rows.forEach((row) => {
      const id = row.id;
      const name = row.name;
      console.log(id, name);
    });
  });
});

db.close();
