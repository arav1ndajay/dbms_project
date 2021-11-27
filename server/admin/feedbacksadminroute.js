module.exports = function (app, db) {
  app.get("/getFeedbackQuestions", (req, res) => {
    if (req.session.user !== undefined) {
      if (
        req.session.user[0].Role == "admin" ||
        req.session.user[0].Role == "customer"
      ) {
        db.query("SELECT * FROM FeedbackQuestions", (err, result) => {
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

  app.post("/getShopRating", (req, res) => {
    const SHID = req.body.SHID;

    if (req.session.user !== undefined) {
      if (
        req.session.user[0].Role == "admin" ||
        req.session.user[0].Role == "shopkeeper"
      ) {
        db.query("SELECT getRating (?) AS rating;", [SHID], (err, result) => {
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

  app.post("/updateFeedbackQuestions", (req, res) => {
    const q1 = req.body.q1;
    const q2 = req.body.q2;
    const q3 = req.body.q3;

    console.log(q1);

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        if (q1 !== "") {
          db.query(
            "UPDATE FeedbackQuestions SET Q1 = ?",
            [q1],
            (err, result) => {
              console.log(result);
              if (err) {
                res.send({ message: "Error occurred. Please try again" });
              }
            }
          );
        }
        if (q2 !== "") {
          db.query(
            "UPDATE FeedbackQuestions SET Q2 = ?",
            [q2],
            (err, result) => {
              if (err) {
                res.send({ message: "Error occurred. Please try again" });
              }
            }
          );
        }
        if (q3 !== "") {
          db.query(
            "UPDATE FeedbackQuestions SET Q3 = ?",
            [q3],
            (err, result) => {
              if (err) {
                res.send({ message: "Error occurred. Please try again" });
              }
            }
          );
        }

        res.send({ message: "Question(s) updated." });
      } else {
        res.send({ message: "You are not an admin." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
};
