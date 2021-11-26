module.exports = function (app, db) {
  app.post("/markAttendance", (req, res) => {
    var GDID;
    const readyTime = req.body.readyTime
    const dateOfWork = req.body.dateOfWork

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
                "INSERT INTO gattendance VALUES (?,?,?)",
                [GDID, readyTime, dateOfWork],
                (err, result) => {
                  if (err) {
                    res.send({ message: "Error occurred. Please try again" });
                  } else {
                    res.send({ message: "Attendance marked successfully!"});
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
                  } else if(result.length > 0) {
                    console.log(result);
                    res.send({ message: "You have marked today's attendance.", result });
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
}

