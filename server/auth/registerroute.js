const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (app, db) {
  app.post("/registerUser", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const role = req.body.role;

    if (password != confirmPassword) {
      res.send({ message: "Passwords do not match! Please try again." });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          "INSERT INTO users (Email, Role, Password) VALUES (?,?,?)",
          [email, role, hash],
          (err, result) => {
            if (err) {
              res.send({ message: "An error occurrred. Please try again." });
            } else {
              res.send({
                message:
                  "Registered successfully! Please wait for verification before logging in.",
              });
            }
          }
        );
      }
    });
  });

  app.post("/registerAdmin", (req, res) => {
    const aname = req.body.aname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO Admin (AName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [aname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerGuest", (req, res) => {
    const gname = req.body.gname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO guest (GName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [gname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerGardener", (req, res) => {
    const gdname = req.body.gdname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO gardener (GDName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [gdname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerMechanic", (req, res) => {
    const mname = req.body.mname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO Mechanic (MName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [mname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerStaff", (req, res) => {
    const stname = req.body.stname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;
    const stype = req.body.stype;

    var reqNumDays = 0;

    if (stype === "regcook") reqNumDays = 5;
    else if (stype === "chscook") reqNumDays = 6;

    db.query(
      "INSERT INTO Staff (STName, ContactNum, DOB, Email, SType, ReqNumDays) VALUES (?,?,?,?,?,?)",
      [stname, contactnum, dob, email, stype, reqNumDays],
      (err, result) => {
        if (err) {
          res.send({ message: err.sqlMessage });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerCustomer", (req, res) => {
    const cname = req.body.cname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO Customer (CName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [cname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });

  app.post("/registerShopkeeper", (req, res) => {
    const skname = req.body.skname;
    const contactnum = req.body.contactnum;
    const dob = req.body.dob;
    const email = req.body.email;

    db.query(
      "INSERT INTO Shopkeeper (SKName, ContactNum, DOB, Email) VALUES (?,?,?,?)",
      [skname, contactnum, dob, email],
      (err, result) => {
        if (err) {
          res.send({ message: "An error occurred. Please try again." });
        } else {
          res.send({
            message:
              "Registered successfully! Please wait for verification before logging in.",
          });
        }
      }
    );
  });
};
