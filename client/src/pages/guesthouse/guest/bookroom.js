import React from "react";
import "../../../App.css";
import "./guestprofile.css";
import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./guestnav/Navbar";
import Sidebar from "./guestsidebar/Sidebar";
import { useSidebar } from "./guestsidebar/SidebarHook";

function BookRoom() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [roomID, setRoomID] = useState("");
  //const [roomRent, setRoomRent] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payableRent, setPayableRent] = useState(0);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [bookMessage, setBookMessage] = useState("");

  const roomRent = useRef(0);

  const { isOpen, toggle } = useSidebar();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getAvailableRooms").then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        console.log(response.data);
        setAvailableRooms(response.data);
      }
    });
  }, []);

  useEffect(() => {
    if (endDate > startDate) {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const timeInDays = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
      setPayableRent(timeInDays * roomRent.current);
    }
  }, [roomRent, startDate, endDate]);

  const bookRoom = (event) => {
    event.preventDefault();

    const cd = new Date(Date.now());
    const dateOfBooking =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
    console.log(dateOfBooking);
    
    Axios.post("http://localhost:3001/bookRoom", {
      roomID: roomID,
      dateOfBooking: dateOfBooking,
      startDate: startDate,
      endDate: endDate,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setBookMessage(response.data.message);
      }
      console.log(response);
    });
  };

  const setRoomDetails = (event) => {
    event.preventDefault();

    if (event.target.value !== "") {
      availableRooms.forEach((room) => {
        if (room.RoomID === event.target.value) {
          console.log(room.Rent);
          roomRent.current = room.Rent;
        }
      });
    }
    setRoomID(event.target.value);
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "guest") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <h1>Room Booking</h1>
                <label className="label">Room ID (category)</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={roomID}
                  required
                  onChange={(e) => setRoomDetails(e)}
                >
                  <option value="">Select</option>
                  {availableRooms.map((room, index) => (
                    <option value={room.RoomID} key={room.RoomID}>
                      {room.RoomID} ({room.Category})
                    </option>
                  ))}
                </select>
              </div>
              {roomID !== "" && <p>Per-day rent: INR {roomRent.current}</p>}
              <div className="input-box">
                <div className="input-box">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    name="startdate"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-box">
                <div className="input-box">
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    name="enddate"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <p style={{ fontSize: "18px" }}>
                Rent payable: INR {payableRent}
              </p>
            </div>
            <div className="button-holder">
              <button onClick={(e) => bookRoom(e)}>Book Room</button>
            </div>
            <p style={{ color: "#ed5c49" }}>{bookMessage}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookRoom;
