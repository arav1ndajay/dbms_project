module.exports = function (app, db) {
  app.post("/getLicenseInfo", (req, res) => {
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "SELECT ADDDATE(tenureDate, INTERVAL (LicensePeriod + ExtensionPeriod) DAY) AS LicenseExpiryDate FROM shopownership WHERE SKID = (SELECT SKID FROM shopkeeper WHERE Email = ?)",
          [email],
          (err, result) => {
            if (err) {
              res.send({ message: err.sqlMessage });
            } else if (result.length > 0) {
              //console.log(result);
              res.send(result);
            } else {
              res.send({ message: "You don't have a shop." });
            }
          }
        );
      } else {
        res.send({ message: "You are not a shopkeeper." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/requestExtension", (req, res) => {
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "UPDATE shopownership SET ExtensionRequested = true WHERE SKID = (SELECT SKID FROM shopkeeper WHERE Email = ?)",
          [email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send({ message: "Extension request placed!" });
            }
          }
        );
      } else {
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/hasRequestedExtension", (req, res) => {
    const email = req.body.email;
    console.log(email);

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "SELECT hasPlacedExtensionRequest(?) AS extensionRequested;",
          [email],
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
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getTotalSales", (req, res) => {
    const SHID = req.body.SHID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "SELECT getTotalSales(?) AS totalSales;",
          [SHID],
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
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getPaymentHistory", (req, res) => {
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "SELECT * FROM shoprentpayment WHERE SKID = (SELECT SKID FROM shopkeeper WHERE Email = ?)",
          [email],
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
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getItemsInShop", (req, res) => {
    const SHID = req.body.SHID;

    if (req.session.user !== undefined) {
      if (
        req.session.user[0].Role == "shopkeeper" ||
        req.session.user[0].Role == "customer"
      ) {
        db.query(
          "SELECT * FROM itemsinshop WHERE SHID = ?",
          [SHID],
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
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/addItemToShop", (req, res) => {
    const SHID = req.body.shopID;
    const itemName = req.body.itemName;
    const price = req.body.price;
    const expiryDate = req.body.expiryDate;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "INSERT INTO ItemsInShop (SHID, itemName, Price, expiryDate) VALUES (?,?,?,?)",
          [SHID, itemName, price, expiryDate],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send({
                message:
                  "Item added successfully! Please refresh to view changes.",
              });
            }
          }
        );
      } else {
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getShopID", (req, res) => {
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "SELECT SHID FROM Shopownership WHERE SKID = (SELECT SKID FROM shopkeeper WHERE Email = ?)",
          [email],
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
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/deleteItemFromShop", (req, res) => {
    const itemID = req.body.itemID;
    const shopID = req.body.shopID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "DELETE FROM itemsinshop WHERE ItemID = ? AND SHID = ?",
          [itemID, shopID],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send({
                message: "Please refresh to view changes.",
              });
            }
          }
        );
      } else {
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/addReceipt", (req, res) => {
    const itemID = req.body.itemID;
    const shopID = req.body.shopID;
    const customerID = req.body.customerID;
    const quantity = req.body.quantity;
    const purchaseDate = req.body.purchaseDate;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "shopkeeper") {
        db.query(
          "CALL addReceipt (?,?,?,?,?)",
          [itemID, shopID, customerID, quantity, purchaseDate],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send({
                message: "Receipt has been added.",
              });
            }
          }
        );
      } else {
        res.send({ message: "You are not a shopkeeper" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
};
