module.exports = function (app, db) {
  app.post("/addArea", (req, res) => {
    const areaType = req.body.areaType;
    const areaTime = req.body.areaTime;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "INSERT INTO area (time, type) VALUES (?,?)",
        [areaTime, areaType],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "New area added!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.post("/createRequest", (req, res) => {
    const areaID = req.body.areaID;

    var time;

    const cd = new Date(Date.now());
    const DateOfRequest =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    if (req.session.user[0].Role == "admin") {
      db.query(
        "SELECT time FROM area WHERE ARID = ?",
        [areaID],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            time = result[0].time;
            console.log(time);
            db.query(
              "INSERT INTO request (ARID, DateOfRequest, rem_time) VALUES (?,?,?)",
              [areaID, DateOfRequest, time],
              (err, result) => {
                if (err) {
                  res.send({ message: err.sqlMessage });
                } else {
                  console.log(result);
                  res.send({ message: "New request added!" });
                }
              }
            );
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });

  app.get("/areasNotRequested", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT ARID FROM Area WHERE ARID NOT IN (SELECT ARID FROM request)",
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
};
