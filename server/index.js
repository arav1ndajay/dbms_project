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
  const role = req.body.role;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        "INSERT INTO users (Email, Role, Password) VALUES (?,?,?)",
        [email, role, hash],
        (err, result) => {
          console.log(err);
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
              req.session.user = result;
              console.log(req.session.user);
              res.send(result);
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

app.listen(3001, () => {
  console.log("Running on port 3001");
});
