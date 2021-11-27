module.exports = function (app, db) {
  app.post("/submitFeedback", (req, res) => {
    const q1rating = req.body.q1rating;
    const q2rating = req.body.q2rating;
    const q3rating = req.body.q3rating;
    const comments = req.body.comments;
    const shopID = req.body.shopID;
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "customer") {
        db.query(
          "SELECT CID FROM customer WHERE Email = ?",
          [email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              db.query(
                "INSERT INTO Feedback (CID, SHID, R1, R2, R3, Comments) VALUES (?,?,?,?,?,?)",
                [result[0].CID, shopID, q1rating, q2rating, q3rating, comments],
                (err, result) => {
                  if (err) {
                    res.send({ message: err.sqlMessage });
                  } else {
                    console.log(result);
                    res.send({
                      message: "Feedback submitted.",
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a customer." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getPastPurchases", (req, res) => {
    const shopID = req.body.SHID;
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "customer") {
        db.query(
          "SELECT CID FROM customer WHERE Email = ?",
          [email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              db.query(
                "SELECT * FROM shopreceipt WHERE CID = ? AND SHID = ?",
                [result[0].CID, shopID],
                (err, result) => {
                  if (err) {
                    res.send({ message: err.sqlMessage });
                  } else {
                    console.log(result);
                    res.send(result);
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a customer." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/getShopIDsWithItems", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "customer") {
        db.query(
          "SELECT DISTINCT SHID FROM itemsinshop",

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
};
