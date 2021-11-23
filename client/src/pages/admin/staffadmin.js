import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function StaffAdmin() {
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

  const generateStaffSchedule = (event) => {
    event.preventDefault();
  }

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "admin") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Staff Scheduler</h1>
          <h2>This week's schedule</h2>
          <div className="button-holder">
            <button onClick={(e) => generateStaffSchedule(e)}>
              {" "}
              Generate new weekly schedule{" "}
            </button>
          </div>
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default StaffAdmin;
