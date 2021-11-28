module.exports = function (app, db) {
  app.post("/getMyStaffSchedule", (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    var STID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "staff") {
        db.query(
          "SELECT STID FROM staff WHERE Email = ?",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              STID = result[0].STID;
              db.query(
                "SELECT * FROM staffdutylog WHERE Date >= ? AND Date <= ? AND (LOCATE(?, Shift_1) != 0 OR LOCATE(?, Shift_2) != 0)",
                [startDate, endDate, STID, STID],
                (err, result) => {
                  if (err) {
                    res.send({ error: "Error occurred. Please try again" });
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
        res.send({ error: "You are not a staff" });
      }
    } else {
      res.send({ error: "No session found" });
    }
  });
};
