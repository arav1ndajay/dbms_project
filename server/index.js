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

const { db } = require("./db");

require("./auth/loginroute")(app, db);
require("./auth/registerroute")(app, db);
require("./admin/userverifroute")(app, db);
require("./guesthouse/guestroute")(app, db);
require("./admin/guestadminroute")(app, db);
require("./admin/mechanicadminroute")(app, db);
require("./admin/arearequestroute")(app, db);
require("./admin/shopadminroute")(app, db);
require("./admin/staffadminroute")(app, db);
require("./admin/feedbacksadminroute")(app, db);
require("./admin/gardenadminroute")(app, db);
require("./garden/gardenerroute")(app, db);
require("./market/shopkeeperroute")(app, db);
require("./market/customerroute")(app, db);
require("./garden/mechanicroute")(app, db);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
