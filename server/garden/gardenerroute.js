module.exports = function (app, db) {
  app.post("/markAttendance", (req, res) => {
    var GDID;
    const dateOfDuty = req.body.dateOfDuty;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query(
          "SELECT GDID FROM gardener WHERE Email = ?",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              GDID = result[0].GDID;
              db.query(
                "UPDATE duty SET Status = 'P' WHERE GDID = ? AND DateOfDuty = ?",
                [GDID, dateOfDuty],
                (err, result) => {
                  if (err) {
                    res.send({ message: "Error occurred. Please try again" });
                  } else {
                    res.send({ message: "Attendance marked successfully!" });
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
  app.get("/attendanceMarked", (req, res) => {
    var GDID;

    const cd = new Date(Date.now());
    const dateOfWork =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
    console.log(dateOfWork);
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query(
          "SELECT GDID FROM gardener WHERE Email = ?",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              GDID = result[0].GDID;
              db.query(
                "SELECT * FROM gattendance WHERE GDID = ? AND DateOfWork = ?",
                [GDID, dateOfWork],
                (err, result) => {
                  if (err) {
                    res.send({ error: "Error occurred. Please try again" });
                  } else if (result.length > 0) {
                    console.log(result);
                    res.send({
                      message: "You have marked today's attendance.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/getThisWeeksDuty", (req, res) => {
    const email = req.body.email;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query(
          "SELECT GDID FROM Gardener WHERE Email = ?",
          [email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              GDID = result[0].GDID;
              db.query(
                "SELECT * FROM duty WHERE GDID = ?",
                [GDID],
                (err, result) => {
                  if (err) {
                    res.send({ error: "Error occurred. Please try again" });
                  } else if (result.length > 0) {
                    console.log(result);
                    res.send(result);
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.get("/getAvailableTools", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query("SELECT * from tool WHERE Status = 'A'", (err, result) => {
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

  app.get("/getUsingTools", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query(
          "SELECT TID from toolusing WHERE GDID = (SELECT GDID FROM Gardener WHERE Email = ?)",
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
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/returnTool", (req, res) => {
    const TID = req.body.TID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query("CALL returnTool(?)", [TID], (err, result) => {
          if (err) {
            res.send({ message: "Error occurred. Please try again" });
          } else {
            res.send({ message: "Tool returned." });
          }
        });
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/setGardenerTool", (req, res) => {
    const TID = req.body.TID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "gardener") {
        db.query(
          "CALL setGardenerTool(?,?)",
          [TID, req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              res.send({ message: "Tool can now be used." });
            }
          }
        );
      } else {
        res.send({ message: "You are not a gardener." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
};
