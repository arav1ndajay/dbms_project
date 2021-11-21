const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");

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

const {db} = require("./db")

require("./auth/loginroute")(app, db);
require("./auth/registerroute")(app, db);
require("./admin/userverifroute")(app, db);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
