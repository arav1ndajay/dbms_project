module.exports = function (app, db) {
  app.get("/getThisWeeksDuty", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM Duty", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send(result);
          }
        });
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/createWeeklySchedule", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("CALL set_week();", (err, result) => {
          if (err) {
            res.send({ error: "Error occurred. Please try again" });
          } else {
            res.send({ message: "Schedule generated." });
          }
        });
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/saveGardenerDutyHistory", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("CALL saveGardenerDutyHistory()", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send({ message: "Duties logged successfully!" });
          }
        });
      } else {
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/viewDutyHistory", (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT * FROM duty_history WHERE DateOfDuty >= ? AND DateOfDuty <= ? ",
          [startDate, endDate],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send(result);
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

  app.post("/getMonthlySalary", (req, res) => {
    const year = req.body.year;
    const month = req.body.month;
    const hourlyRate = req.body.hourlyRate;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "CALL get_salary(?,?,?)",
          [year, month, hourlyRate],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send(result);
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

  app.get("/getToolsBeingUsed", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM toolusing", (err, result) => {
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
};
