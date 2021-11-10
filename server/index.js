const express = require("express");
const app = express();
const mysql = require("mysql")

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass123',
  database: 'employee',
})

app.post("/api/insert", (req, response) => {
  const sqlInsert =
    "INSERT INTO emp VALUES ('600','601','Tao','2021-01-01','10000', 'CSE', '9876543210', 'hutao@gmail.com');";
  db.query();

  });

app.listen(3001, () => {
  console.log("Running port 3001");
});
