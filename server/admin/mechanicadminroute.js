module.exports = function (app, db) {
  app.get("/getAvailableMechanics", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM mechanic WHERE Status = 'A'", (err, result) => {
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

  app.get("/getPendingPayments", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT * FROM toolrepairhistory WHERE PaymentStatus = false",
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

  app.get("/getTools", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM tool", (err, result) => {
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

  app.post("/addTool", (req, res) => {
    const toolName = req.body.toolName;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "INSERT INTO Tool (TName) VALUES (?)",
          [toolName],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              res.send({ message: "Tool added!" });
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

  app.post("/markAsPaid", (req, res) => {
    const TRID = req.body.TRID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "UPDATE toolrepairhistory SET PaymentStatus = true WHERE TRID = ?",
          [TRID],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              res.send({ message: "Payment marked." });
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

  app.post("/assignToolToMechanic", (req, res) => {
    const TID = req.body.toolToRepair;
    const MID = req.body.MID;

    const cd = new Date(Date.now());
    const currentDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "CALL assignToolToMechanic (?,?,?)",
          [TID, MID, currentDate],
          (err, result) => {
            if (err) {
              res.send({ error: "Error occurred. Please try again" });
            } else {
              res.send({ message: "Tool assigned to mechanic." });
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

  app.get("/getToolsBeingRepaired", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query("SELECT * FROM toolrepairing", (err, result) => {
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
