module.exports = function (app, db) {
  app.get("/toolsAssigned", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "mechanic") {
        db.query(
          "SELECT TID, TName FROM tool WHERE TID IN (SELECT TID FROM toolrepairing WHERE MID = (SELECT MID FROM Mechanic WHERE Email = ?))",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send(result);
            }
          }
        );
      } else {
        res.send({ message: "You are not a mechanic" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/markToolAsRepaired", (req, res) => {
    const TID = req.body.TID;
    const amount = req.body.amount;

    const cd = new Date(Date.now());
    const currentDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    var MID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "mechanic") {
        db.query(
          "SELECT MID FROM Mechanic WHERE Email = ?",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ error: err.sqlMessage });
            } else {
              MID = result[0].MID;
              db.query(
                "CALL markToolAsRepaired(?,?,?,?)",
                [TID, MID, currentDate, amount],
                (err, result) => {
                  if (err) {
                    res.send({ error: err.sqlMessage });
                  } else {
                    res.send({ message: "Tool marked as repaired." });
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a mechanic" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
};
