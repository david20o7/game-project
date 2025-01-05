const express = require("express"); //import express
const SQL = require("sqlite3").verbose(); // import sqlite3
const path = require("path");
const session = require("express-session");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const bcrypt = require("bcrypt");

// Set up LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");

const app = express();

const PORT = 3000;

const Database_Name = "my-database.db";
const db = new SQL.Database(Database_Name);

const saltRounds = 10;

// copied
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(connectLivereload());
app.use(express.json());

// Middleware to test if authenticated
const isAuthenticated = (req, res, next) => {
  // console.log(req.session.user);
  if (req.session.user) {
    next();
  } else {
    res.redirect("/accounts"); // Redirect to /accounts if not authenticated
  }
};

// Serve static files from 'public/movement'
app.use("/movement", isAuthenticated, express.static(path.join(__dirname, "public", "movement")));

// Serve static files from 'public'
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/accounts"); // Redirect to /accounts if not authenticated
});

// TODO: change this to work with the game_data instead
app.get("/users", (req, res, next) => {
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

    // array of stuff like {"id":7,"name":"Fiona Fionason","score":400}
    res.json(rows);
  });
});

// adding the score to the DB
// TODO: change this to work with the user
app.post("/submitScore", (req, res) => {
  const { score, username } = req.body;

  db.get(`SELECT * FROM user WHERE name = ?`, [username], (err, result) => {
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

app.get("/accountList", (req, res) => {
  db.all("SELECT * FROM account", (error, rows) => {
    res.json(rows);
  });
});

app.post("/endpoint", (req, res) => {
  const { username } = req.body;

  db.get("SELECT * FROM account WHERE username = ? ", [username]);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.status(409).send("Invalid");
    return;
  }

  db.get("SELECT * FROM account WHERE username = ?", [username], (error, row) => {
    if (error) {
      res.status(500).send("Invalid username or password.");
    } else if (row) {
      // Load hash from your password DB.
      const isPasswordCorrect = bcrypt.compareSync(password, row.password);

      if (!isPasswordCorrect) {
        res.status(401).send("Invalid username or password.");
      }

      // COPIED: https://github.com/expressjs/session?tab=readme-ov-file#user-login
      req.session.regenerate((err) => {
        if (err) next(err);

        // store user information in session, typically a user id
        req.session.user = username;
        req.session.save((err) => {
          if (err) {
            res.status(500).send("something wrong with the session");
          } else {
            res.status(200).send("Login successful!");
          }
        });
      });
    } else {
      res.status(401).send("Invalid username or password.");
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.user = null;
  req.session.destroy();

  // TODO: Add 'logout successful' message
  res.redirect("/accounts");
});

app.post("/register", (req, res) => {
  // do something
  const { password, username } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.status(409).send("invalid / already exists");
    return;
  }

  // COPIED: https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file#usage

  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.

    db.all(
      "INSERT INTO account (username, password) VALUES(?, ?)",
      [username, hash],
      (error, result) => {
        if (error) {
          res.status(409).send("username exists");
        } else {
          res.send(201).send();
        }
      }
    );
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
