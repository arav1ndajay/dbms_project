const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    key: "email",
    secret: "dbmsproj",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass123",
  database: "project",
});

app.post("/registerAdmin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const role = req.body.role;

  if(password != confirmPassword){
    res.send({error: "Passwords do not match! Please try again."});
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        "INSERT INTO users (Email, Role, Password) VALUES (?,?,?)",
        [email, role, hash],
        (err, result) => {
          if(err){
            res.send({error: "An error occurrred. Please try again."})
          } else{
            res.send({message: "Registered successfully!"});
          }
        }
      );
    }
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  if (email == "" || password == "") {
    res.send({ message: "One or more fields are empty!" });
  } else {
    db.query(
      "SELECT * FROM users WHERE email = ? AND role = ?;",
      [email, role],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else if (result.length > 0) {
          bcrypt.compare(password, result[0].Password, (error, res2) => {
            if (res2) {
              if (result[0].Verified == 0) {
                res.send({
                  message:
                    "Admins have not verified this account. Please try again later.",
                });
              } else {
                req.session.user = result;
                console.log(req.session.user);
                res.send(result);
              }
            } else {
              res.send({ message: "Incorrect email/password combination." });
            }
          });
        } else {
          res.send({ message: "User does not exist." });
        }
      }
    );
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("email");
  res.send("done");
  console.log("Logged out!");
});

app.post("/getUserDetails", (req, res) => {
  if (req.session.user[0].Role == "admin") {
    db.query(
      "SELECT UID, Email, Role, Verified FROM users WHERE Verified = 0",
      (err, result) => {
        if (err) {
          res.send({ message: "Error occurred. Please try again" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } else {
    res.send({ message: "Administrator privileges required." });
  }
});

app.post("/verifyUsers", (req, res) => {
  const usersToVerify = req.body.usersToVerify;

  if (req.session.user[0].Role == "admin") {
    db.query(
      "UPDATE users SET Verified = true WHERE UID IN (?)",
      [usersToVerify],
      (err, result) => {
        if (err) {
          res.send({ message: err.sqlMessage });
        } else {
          console.log(result);
          res.send({ message: "Users successfully verified!" });
        }
      }
    );
  } else {
    res.send({ message: "Administrator privileges required." });
  }
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
