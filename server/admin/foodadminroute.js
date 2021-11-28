module.exports = function (app, db) {
  app.get("/getFoods", (req, res) => {
    if (req.session.user !== undefined) {
      if (
        req.session.user[0].Role == "admin" ||
        req.session.user[0].Role == "guest"
      ) {
        db.query("SELECT * FROM food", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send(result);
          }
        });
      } else {
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/addFood", (req, res) => {
    const FName = req.body.FName;
    const price = req.body.price;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "INSERT INTO Food (FName, Price) VALUES (?,?)",
          [FName, price],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send({ message: "Food updated." });
            }
          }
        );
      } else {
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/removeFood", (req, res) => {
    const FID = req.body.FID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("DELETE FROM food WHERE FID = ?", [FID], (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send({ message: "Food removed." });
          }
        });
      } else {
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/getAllOrders", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM FoodBookings", (err, result) => {
          if (err) {
            res.send({ error: err.sqlMessage });
          } else {
            console.log(result);
            res.send(result);
          }
        });
      } else {
        res.send({ error: "You are not an admin." });
      }
    } else {
      res.send({ error: "No session found" });
    }
  });

  app.post("/setOrderAsPaid", (req, res) => {
    const FBID = req.body.FBID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "UPDATE FoodBookings SET PaymentStatus = true WHERE FBID = ?",
          [FBID],
          (err, result) => {
            if (err) {
              res.send({ error: err.sqlMessage });
            } else {
              console.log(result);
              res.send({ message: "Order payment confirmed." });
            }
          }
        );
      } else {
        res.send({ error: "You are not an admin." });
      }
    } else {
      res.send({ error: "No session found" });
    }
  });
};
