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
        res.send({ message: "You are not a mechanic" });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
};
