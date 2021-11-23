module.exports = function (app, db) {
  app.get("/pendingRooms", (req, res) => {

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "admin") {
        db.query(
          "SELECT RBID, RoomID, GID, DateOfBooking, StartDate, EndDate, Price FROM roombookings WHERE ApprovalStatus = 'P'",
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
        res.send({ message: "You are not an admin." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });

  app.post("/approveRooms", (req, res) => {
    const roomsToApprove = req.body.roomsToApprove;

    if (req.session.user[0].Role == "admin") {
      db.query(
        "UPDATE roombookings SET ApprovalStatus = 'A' WHERE roomID IN (?)",
        [roomsToApprove],
        (err, result) => {
          if (err) {
            res.send({ message: err.sqlMessage });
          } else {
            console.log(result);
            res.send({ message: "Rooms successfully approved!" });
          }
        }
      );
    } else {
      res.send({ message: "Administrator privileges required." });
    }
  });
};
