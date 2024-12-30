const express = require("express"); //import express
const SQL = require("sqlite3").verbose(); // import sqlite3
const path = require("path");

const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// Set up LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");

const app = express();

const PORT = 3000;

const Database_Name = "my-database.db";
const db = new SQL.Database(Database_Name);

// app.use(express.urlencoded({ extended: true }));

app.use(connectLivereload());
app.use(express.json());

// Serve static files from the 'public' direcladtory
app.use(express.static(path.join(__dirname, "public", "movement")));

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.get("/users", (req, res) => {
  // Run a query where we want to process the output
  db.all("SELECT * FROM user ORDER BY score DESC;", (error, rows) => {
    if (error) {
      res.status(500).send("An error occurred while querying the database");
      console.error("Database query error: ", error);
      return;
    }

    if (rows.length === 0) {
      res.status(404).send("No users found");
      return;
    }

    res.json(rows);
  });
});

app.post("/submitScore", (req, res) => {
  // const username = req.body.username;
  // const score = req.body.score;
  const { score, username } = req.body;

  db.get(`SELECT * FROM user WHERE name = ?`, [username], (err, result) => {
    // TODO: ERROR HANDLING
    // undefined | {id: , name: '', score:}
    if (result === undefined) {
      db.run("INSERT INTO user (name, score) VALUES(?, ?)", [username, score]);
    } else {
      if (result.score < score) {
        db.run("UPDATE user SET score = ? WHERE name = ?", [score, username]);
      }
    }
  });

  res.send();
});

app.get("/userHighScore", (req, res) => {
  const params = req.query;
  db.get(`SELECT * FROM user WHERE name = ?`, [params.username], (err, result) => {
    res.json(result || {});
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // console.log(`try http://localhost:${PORT}/movement`);
  console.log(`To stop the server, CTRL + C`);
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// class DataBase {

//   constructor() {

//   }

//   get(query, parameters, fn) {
//     /// runs query with pareeters

//     // gets result
//     // calls the function WITH the result

//     fn(result)

//   }
// }

// const dbb = new Database()
