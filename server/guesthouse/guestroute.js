module.exports = function (app, db) {
  app.post("/getAvailableRooms", (req, res) => {
    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "guest") {
        db.query(
          "SELECT RoomID, Rent, Category FROM room WHERE RoomID NOT IN (SELECT RoomID FROM RoomBookings)",
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
        res.send({ message: "You are not a guest." });
      }
    } else {
      res.send({ message: "No session found" });
    }
  });
  app.post("/bookRoom", (req, res) => {
    const roomID = req.body.roomID;
    const dateOfBooking = req.body.dateOfBooking;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    var GID;

    if (req.session.user !== undefined) {
      if (req.session.user[0].Role == "guest") {
        db.query(
          "SELECT GID FROM guest WHERE Email = ?",
          [req.session.user[0].Email],
          (err, result) => {
            if (err) {
              res.send({ message: "Error occurred. Please try again" });
            } else {
              GID = result[0].GID;
              db.query(
                "INSERT INTO roombookings (RoomID, GID, DateOfBooking, StartDate, EndDate) VALUES (?, ?, ?, ?, ?);",
                [roomID, GID, dateOfBooking, startDate, endDate],
                (err, result) => {
                  if (err) {
                    res.send({ message: "Error occurred. Please try again" });
                  } else {
                    console.log(result);
                    res.send({ message: "Room booked successfully!" });
                  }
                }
              );
            }
          }
        );
      } else {
        res.send({ message: "You are not a guest." });
      }
    } else {
      res.send({ message: "No session found." });
    }
  });
};
