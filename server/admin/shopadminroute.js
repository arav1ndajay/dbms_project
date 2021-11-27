module.exports = function (app, db) {
  app.post("/addShop", (req, res) => {
    const shopArea = req.body.shopArea;
    const rent = req.body.rent;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "INSERT INTO shop (shopArea, Rent) VALUES (?,?)",
        [shopArea, rent],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "New shop added!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.post("/addShopPayment", (req, res) => {
    const SKID = req.body.SKID;
    const deposit = req.body.deposit;
    const depositDate = req.body.depositDate;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "INSERT INTO shoprentpayment (SKID, deposit, depositDate) VALUES (?,?,?)",
        [SKID, deposit, depositDate],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "Payment added!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.get("/getUnassignedShopkeepers", (req, res) => {
    if (req.session.user[0].Role == "admin") {
      db.query(
        "SELECT SKID FROM shopkeeper WHERE SKID NOT IN (SELECT SKID FROM shopownership)",
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
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

  app.get("/getShopkeepers", (req, res) => {
    if (req.session.user[0].Role == "admin") {
      db.query("SELECT SKID FROM shopownership", (err, result) => {
        if (err) {
          res.send({ message: err.sqlMessage });
        } else {
          console.log(result);
          res.send(result);
        }
      });
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.get("/getShopIDs", (req, res) => {
    if (
      req.session.user[0].Role == "admin" ||
      req.session.user[0].Role == "customer"
    ) {
      db.query("SELECT SHID FROM shopownership", (err, result) => {
        if (err) {
          res.send({ message: err.sqlMessage });
        } else {
          console.log(result);
          res.send(result);
        }
      });
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.get("/getUnassignedShops", (req, res) => {
    if (req.session.user[0].Role == "admin") {
      db.query(
        "SELECT SHID FROM shop WHERE SHID NOT IN (SELECT SHID FROM shopownership)",
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
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

  app.get("/getExtensionRequests", (req, res) => {
    if (req.session.user[0].Role == "admin") {
      db.query(
        "SELECT SKID FROM shopownership WHERE ExtensionRequested = true",
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            res.send(result);
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.post("/extendLicense", (req, res) => {
    const SKID = req.body.SKID;
    const extensionPeriod = req.body.extensionPeriod;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "UPDATE shopownership SET ExtensionPeriod = ?, ExtensionRequested = false WHERE SKID = ?;",
        [extensionPeriod, SKID],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            res.send({ message: "License extended successfully." });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.post("/assignShopkeeper", (req, res) => {
    const SKID = req.body.SKID;
    const SHID = req.body.SHID;
    const LicensePeriod = req.body.LicensePeriod;

    const cd = new Date(Date.now());
    const tenureDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    if (req.session.user[0].Role == "admin") {
      db.query(
        "INSERT INTO shopownership (SKID, SHID, LicensePeriod, tenureDate) VALUES (?,?,?,?)",
        [SKID, SHID, LicensePeriod, tenureDate],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "Shop assigned to shopkeeper." });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });
};
