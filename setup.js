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
  db.run("CREATE TABLE user (id INT, name TEXT, score INT)");

  db.run("INSERT INTO user (id,name, score) Values(1, 'Bobby bobbyson', 300)");
  db.run("INSERT INTO user (id,name, score) Values(2, 'William Williamson', 100)");
  db.run("INSERT INTO user (id,name, score) Values(3, 'Steevie Steevieson', 200)");
  db.run("INSERT INTO user (id, name, score) VALUES (4, 'Charlie Charlson', 250)");
  db.run("INSERT INTO user (id, name, score) VALUES (5, 'Emily Emmerson', 150)");
  db.run("INSERT INTO user (id, name, score) VALUES (6, 'David Davidson', 350)");
  db.run("INSERT INTO user (id, name, score) VALUES (7, 'Fiona Fionason', 400)");
  db.run("INSERT INTO user (id, name, score) VALUES (8, 'George Georgison', 175)");
  db.run("INSERT INTO user (id, name, score) VALUES (9, 'Hannah Hannason', 225)");

  //run a query where we want to process the output
  db.all("SELECT * FROM user", (error, rows) => {
    rows.forEach((row) => {
      const id = row.id;
      const name = row.name;
    });
  });
});

db.close();
