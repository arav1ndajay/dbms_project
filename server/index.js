const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.json());
app.use(cors());

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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  db.query(
    "SELECT * FROM users WHERE email = ? AND role = ?;",
    [email, role],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].Password, (error, res2) => {
          if (res2) {
            res.send(result);
          } else {
            res.send({ message: "Wrong email/password combination" });
          }
        });
      } else {
        res.send({ message: "User does not exist." });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
