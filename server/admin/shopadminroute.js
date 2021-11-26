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
