module.exports = function (app, db) {
  app.get("/getLoggedDates", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT Date FROM staffdutylog", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            console.log(result);
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

  app.post("/getLoggedData", (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT * FROM staffdutylog WHERE Date >= ? AND Date <= ?",
          [startDate, endDate],
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
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/getStaffDetails", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM staff", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            console.log(result);
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

  app.get("/getWeeklySchedule", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM staffdutyroster", (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            console.log(result);
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

  app.get("/generateStaffSchedule", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "CALL generateStaffRoster ('GH100', curdate());",
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              db.query("SELECT * FROM staffdutyroster;", (err, result2) => {
                if (err) {
                  res.send({ message: "Error occurred. Please try again" });
                } else {
                  console.log(result2);
                  res.send(result2);
                }
              });
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

  app.post("/updateStaffSchedule", (req, res) => {
    const staffString = req.body.staffString;
    const dateToUpdate = req.body.dateToUpdate;
    const shift = req.body.shift;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        if (shift === "Shift_1") {
          db.query(
            "UPDATE staffdutyroster SET Shift_1 = ? WHERE Date = ?;",
            [staffString, dateToUpdate],
            (err, result) => {
              if (err) {
                res.send({ message: "Error occurred. Please try again" });
              } else {
                db.query("SELECT * FROM staffdutyroster;", (err, result2) => {
                  if (err) {
                    res.send({ message: "Error occurred. Please try again" });
                  } else {
                    console.log(result2);
                    res.send(result2);
                  }
                });
              }
            }
          );
        } else if (shift === "Shift_2") {
          db.query(
            "UPDATE staffdutyroster SET Shift_2 = ? WHERE Date = ?;",
            [staffString, dateToUpdate],
            (err, result) => {
              if (err) {
                res.send({ message: "Error occurred. Please try again" });
              } else {
                db.query("SELECT * FROM staffdutyroster;", (err, result2) => {
                  if (err) {
                    res.send({ message: "Error occurred. Please try again" });
                  } else {
                    console.log(result2);
                    res.send(result2);
                  }
                });
              }
            }
          );
        }
      } else {
        res.send({ message: "You are not an admin" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/fixSchedule", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "INSERT INTO StaffDutyLog SELECT * FROM staffdutyroster",
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              console.log(result);
              res.send({ message: "Schedule logged successfully!" });
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
};
