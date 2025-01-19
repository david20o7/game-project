const express = require("express"); //import express
const SQL = require("sqlite3").verbose(); // import sqlite3
const path = require("path");
const session = require("express-session");
const livereload = require("livereload");
const bcrypt = require("bcrypt");

const app = express();

const Database_Name = "my-database.db";
const db = new SQL.Database(Database_Name);

//https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// DO NOT COPY:
// Set up LiveReload server
const connectLivereload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");
app.use(connectLivereload());
//

app.use(express.json());

// Middleware to test if the user is logged in and redirects them to the login page
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/accounts");
  }
};

// Serve static files from 'public/movement'
// we do this to make sure that the user is authenticated before they are allowed to play the game
app.use("/movement", isLoggedIn, express.static(path.join(__dirname, "public", "movement")));

// Serve static files from 'public'
app.use(express.static("public"));

// Redirect to /accounts if not authenticated
app.get("/", (req, res) => {
  res.redirect("/accounts");
});

app.get("/leaderboardData", (req, res) => {
  // go through the game_data table and find the usernames from the user_id foreign key
  db.all(
    `SELECT game_data.high_score, account.username FROM game_data JOIN account ON account.user_id = game_data.user_id ORDER BY game_data.high_score DESC`,
    (error, rows) => {
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
    }
  );
});

// adding the score to the database
app.post("/submitScore", (req, res) => {
  const userData = req.session.user; // an entire row from the accounts table

  if (userData === undefined) {
    res.send();
    return;
  }
  const userId = userData.user_id;
  const { high_score } = req.body;

  db.run(`UPDATE game_data SET high_score = ? WHERE user_id = ? `, [high_score, userId]);

  res.send();
});

// used to get the high score of a user on the /movement page
app.get("/getGameData", (req, res) => {
  const userData = req.session.user; // an entire row from the accounts

  if (userData === undefined) {
    res.status(409).json({});
    return;
  }

  const userId = userData.user_id;
  const username = userData.username;

  db.get(`SELECT * FROM game_data WHERE user_id = ?`, [userId], (error, result) => {
    if (error || !result) {
      res.status(409).json({});
    } else {
      // we add the username from the session so we can display it
      result.username = username;
      res.json(result);
    }
  });
});

// shows the accounts table (for testing)
app.get("/accountList", (req, res) => {
  db.all("SELECT * FROM account", (error, rows) => {
    res.json(rows);
  });
});

// TODO: David Speak Spellcheck [ ]
// 1. check if the username and password are valid
// 2. we select the row from account with the username
// 3. if we find a row its compared wit the hashed passwords to see if they match
// 4. when the user logs in a new session is made for them
// 5. if all goes well we send a positive response
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.status(409).send("Invalid");
    return;
  }

  db.get("SELECT * FROM account WHERE username = ?", [username], (error, row) => {
    // user is not found in the database
    if (error) {
      res.status(500).send("Invalid username or password.");
    } else if (row) {
      // Load hash from the password DB and compare it with the password from the request
      // the bcrypt.compareSync hashes the password so it doesn't have to be done
      const isPasswordCorrect = bcrypt.compareSync(password, row.password);

      if (!isPasswordCorrect) {
        res.status(401).send("Invalid username or password.");
      } else {
        // COPIED: https://github.com/expressjs/session?tab=readme-ov-file#user-login
        req.session.regenerate((err) => {
          if (err) next(err);

          // store user information in session
          req.session.user = row;
          req.session.save((err) => {
            if (err) {
              res.status(500).send("something wrong with the session");
            } else {
              res.status(200).send("Login successful!");
            }
          });
        });
      }
    } else {
      res.status(401).send("Invalid username or password.");
    }
  });
});

// endpoint which  logs the user out by destroying the session and redirects the user back to accounts
app.get("/logout", (req, res) => {
  req.session.user = null;
  req.session.destroy();

  // redirect
  res.redirect("/accounts");
});

// server endpoint for registering the user
// 1. check if the username and password are valid
// 2. hashes the password before putting into the db
// 3. creates a row in the account table containing the username and hashed password
// 4. get the row we just created because we need the primary key when creating the row in game_data
// 5. create a row in the game_data table using the user_id primary key as a foreign key
// 6. respond with 201 if everything went ok or 409 if any errors occurred along the way

app.post("/register", async (req, res) => {
  const { password, username } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.status(409).send("Invalid username or password");
    return;
  }

  // COPIED: https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file#usage
  // using bcrypt to hash the password before storing it into the database
  const saltRounds = 10;

  const hash = bcrypt.hashSync(password, saltRounds);

  // add the username and password to the account table
  db.run(
    "INSERT INTO account (username, password) VALUES(?, ?)",
    [username, hash],

    (error) => {
      if (error) {
        // if username exists there will be an error because username is set to unique
        res.status(409).send("username exists");
      } else {
        // Get the username from the account table that was just created
        db.get("SELECT * FROM account WHERE username = ?", [username], (error, row) => {
          if (!row || error) {
            res.status(409).send("Cannot find account");
          } else {
            // add an entry into the game_data table for the user that was just created
            db.run(
              "INSERT INTO game_data (user_id, high_score) VALUES(?, ?)",
              [row.user_id, 0],
              (error) => {
                if (error) {
                  // checking if inserting has failed
                  res.status(409).send("Cannot insert user info into leaderboard");
                } else {
                  res.status(201).send();
                }
              }
            );
          }
        });
      }
    }
  );
});

// starts server on localhost 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// TO DELETE, DO NOT COPY
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//
