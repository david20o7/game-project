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
  console.log(req.body);

  res.send();
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
