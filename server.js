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

app.use(connectLivereload());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the root URL
app.get("/login", (req, res) => {
  console.log("sending over the login page");
  res.sendFile(path.join(__dirname, "public", "login", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register", "index.html"));
});

app.get("/movement", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "movement", "index.html"));
});

app.get("/users", (req, res) => {
  console.log("sending over the login page");
  // Run a query where we want to process the output
  db.all("SELECT * FROM user", (error, rows) => {
    if (error) {
      res.status(500).send("An error occurred while querying the database");
      console.error("Database query error: ", error);
      return;
    }

    if (rows.length === 0) {
      res.status(404).send("No users found");
      return;
    }

    const names = rows.map((row) => row.name);
    res.send(names.join(", "));
  });
});

app.get("/boo", (req, res) => {
  console.log("sending over the login page");
  res.send("HELLO");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`try http://localhost:${PORT}/movement`);
  console.log(`To stop the server, CTRL + C`);
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
