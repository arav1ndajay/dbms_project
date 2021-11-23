const bcrypt = require("bcrypt");

module.exports = function (app, db) {
  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    if (email == "" || password == "") {
      res.send({ message: "One or more fields are empty!" });
    } else {
      db.query(
        "SELECT * FROM users WHERE email = ? AND role = ?;",
        [email, role],
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else if (result.length > 0) {
            bcrypt.compare(password, result[0].Password, (error, res2) => {
              if (res2) {
                if (result[0].Verified == 0) {
                  res.send({
                    message:
                      "Admins have not verified this account. Please try again later.",
                  });
                } else {
                  req.session.user = result;
                  console.log(req.session.user);
                  res.send({ user: result });
                }
              } else {
                res.send({ message: "Incorrect email/password combination." });
              }
            });
          } else {
            res.send({ message: "User does not exist." });
          }
        }
      );
    }
  });
  app.post("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("email");
    res.send("done");
    console.log("Logged out!");
  });
};
