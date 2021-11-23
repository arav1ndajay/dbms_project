module.exports = function (app, db) {
  app.post("/getUserDetails", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT UID, Email, Role, Verified FROM users WHERE Verified = 0",
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
        res.send({ message: "Administrator privileges required." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/verifyUsers", (req, res) => {
    const usersToVerify = req.body.usersToVerify;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "UPDATE users SET Verified = true WHERE UID IN (?)",
        [usersToVerify],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "User(s) successfully verified!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });
}
