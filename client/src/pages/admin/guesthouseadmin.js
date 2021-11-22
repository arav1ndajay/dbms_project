import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "../admin/adminnav/Navbar";
import Sidebar from "../admin/adminsidebar/Sidebar";
import { useSidebar } from "../admin/adminsidebar/SidebarHook";

function GuesthouseAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [roomDetailsLoading, setRoomDetailsLoading] = useState(true);
  const [pendingRooms, setPendingRooms] = useState([]);
  const [error, setError] = useState("");

  const { isOpen, toggle } = useSidebar();

  const [roomsToApprove, setRoomsToApprove] = useState(
    new Array(pendingRooms.length).fill(false)
  );

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
    if (loginStatus === "admin") {
      setRoomDetailsLoading(true);

      Axios.get("http://localhost:3001/pendingRooms").then((response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setPendingRooms(response.data);
          setRoomDetailsLoading(false);
        }
      });
    }
  }, [loginStatus]);

  const logoutUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");

    Axios.post("http://localhost:3001/logout", {}).then((response) => {
      setLoginStatus("false");
    });
  };

  const handleCheck = (roomID) => {
    if (roomsToApprove.indexOf(roomID) === -1)
      setRoomsToApprove([...roomsToApprove, roomID]);
    else {
      setRoomsToApprove(roomsToApprove.filter((tempid) => tempid !== roomID));
    }
  };

  const approveRooms = (event) => {
    event.preventDefault();

    setRoomDetailsLoading(true);

    Axios.post("http://localhost:3001/approveRooms", {
      roomsToApprove: roomsToApprove,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);

      const newRooms = pendingRooms.filter(
        (room) => roomsToApprove.indexOf(room.RoomID) === -1
      );

      setRoomsToApprove([]);

      setPendingRooms(newRooms);

      setRoomDetailsLoading(false);

      console.log(response.data);
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "admin") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Pending Room Bookings</h1>
          {roomDetailsLoading ? (
            <div>Loading...</div>
          ) :
          pendingRooms.length > 0 ? (
            <table>
              <tbody>
                <tr>
                  <td>RBID</td>
                  <td>RoomID</td>
                  <td>GID</td>
                  <td>Date of Booking</td>
                  <td>Price</td>
                  <td>Approve</td>
                </tr>
                {pendingRooms.map((room, index) => (
                  <tr key={room.RBID}>
                    <td>{room.RBID}</td>
                    <td>{room.RoomID}</td>
                    <td>{room.GID}</td>
                    <td>{room.DateOfBooking.substring(0, 10)}</td>
                    <td>{room.Price}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          roomsToApprove.indexOf(room.RoomID) === -1
                            ? false
                            : true
                        }
                        onChange={() => handleCheck(room.RoomID)}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No rooms to approve!</div>
          )}
          {roomsToApprove.length > 0 && (
            <button onClick={(e) => approveRooms(e)}> Approve rooms </button>
          )}
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default GuesthouseAdmin;
