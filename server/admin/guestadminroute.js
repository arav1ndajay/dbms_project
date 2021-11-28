module.exports = function (app, db) {
  app.get("/getGHIDs", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT DISTINCT GHID FROM roomof", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send(result);
          }
        });
      } else {
        res.send({ message: "You are not an admin." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/generateExpenditure", (req, res) => {
    const year = req.body.year;
    const month = req.body.month;
    const GHID = req.body.GHID;
    const billamount = req.body.billamount;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "CALL generateExpenditure(?,?,?,?)",
          [year, month, GHID, billamount],
          (err, result) => {
            if (err) {
              if (err.toString().indexOf("Duplicate entry") !== -1)
                res.send({
                  error: "Expenditure already generated for given month.",
                });
              else res.send({ error: err.sqlMessage });
            } else {
              res.send({ message: "Expenditure generated." });
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

  app.post("/viewExpenditure", (req, res) => {
    const year = req.body.year;
    const month = req.body.month;
    const GHID = req.body.GHID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT * FROM expenditures WHERE Month = ? AND Year = ? AND GHID = ?",
          [month, year, GHID],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send(result);
            }
          }
        );
      } else {
        res.send({ message: "You are not an admin." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/pendingRooms", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT RBID, RoomID, GID, DateOfBooking, StartDate, EndDate, Price FROM roombookings WHERE ApprovalStatus = 'P'",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send(result);
            }
          }
        );
      } else {
        res.send({ message: "You are not an admin." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/approveRooms", (req, res) => {
    const roomsToApprove = req.body.roomsToApprove;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "UPDATE roombookings SET ApprovalStatus = 'A' WHERE roomID IN (?)",
        [roomsToApprove],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "Rooms successfully approved!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.post("/getMonthlyBookings", (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    const category = req.body.category;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT * FROM roombookings WHERE MONTH(DateOfBooking) = ? AND YEAR(DateOfBooking) = ? AND ApprovalStatus = 'A' AND RoomID IN (SELECT RoomID FROM Room WHERE Category = ?);",
          [month, year, category],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              res.send(result);
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
