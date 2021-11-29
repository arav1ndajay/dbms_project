import React from "react";
import "../../../App.css";
import "./guestprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./guestnav/Navbar";
import Sidebar from "./guestsidebar/Sidebar";
import { useSidebar } from "./guestsidebar/SidebarHook";
import Loader from "react-loader-spinner";
function GuestProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [bookedRooms, setBookedRooms] = useState([]);
  const { isOpen, toggle } = useSidebar();
  const [currentRooms, setCurrentRooms] = useState([])

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);
        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  useEffect(() => {
    //setRoomDetailsLoading(true)

    console.log("Fetching my bookings");
    Axios.get("http://localhost:3001/myPendingRooms").then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        console.log(response.data);
        setBookedRooms(response.data);
      }
    });
  }, []);

  useEffect(() => {

    Axios.get("http://localhost:3001/myCurrentRooms").then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        console.log(response.data);
        setCurrentRooms(response.data);
      }
    });
  }, []);

  const logoutUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");

    Axios.post("http://localhost:3001/logout", {}).then((response) => {
      setLoginStatus("false");
    });
  };

  if (loginStatus === "loading")
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0",
          height: "100vh",
        }}
      >
        <Loader
          type="Circles"
          color="rgb(164, 121, 182)"
          height={80}
          width={80}
        />
      </div>
    );
  else if (loginStatus !== "guest") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Welcome, {email}</h1>
          <h2>Pending bookings:</h2>
          {bookedRooms.length > 0 ? (
            <table>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>RBID</td>
                  <td style={{ textAlign: "center" }}>RoomID</td>
                  <td style={{ textAlign: "center" }}>Date of Booking</td>
                  <td style={{ textAlign: "center" }}>Price</td>
                </tr>
                {bookedRooms.map((room, index) => (
                  <tr key={room.RBID}>
                    <td>{room.RBID}</td>
                    <td>{room.RoomID}</td>
                    <td>{room.DateOfBooking.substring(0, 10)}</td>
                    <td>{room.Price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No pending bookings!</div>
          )}
          <h2>Current room(s):</h2>
          {currentRooms.length > 0 ? (
            <table>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>RoomID</td>
                  <td style={{ textAlign: "center" }}>Date of Booking</td>
                  <td style={{ textAlign: "center" }}>Start Date</td>
                  <td style={{ textAlign: "center" }}>End Date</td>
                  <td style={{ textAlign: "center" }}>Price</td>
                </tr>
                {currentRooms.map((room, index) => (
                  <tr key={room.RoomID}>
                    <td>{room.RoomID}</td>
                    <td>{room.DateOfBooking.substring(0, 10)}</td>
                    <td>{room.StartDate.substring(0, 10)}</td>
                    <td>{room.EndDate.substring(0, 10)}</td>
                    <td>{room.Price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No rooms approved/booked!</div>
          )}
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestProfile;
