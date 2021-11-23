import React from "react";
import "../../../App.css";
import "./gardenerprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./gardenernav/Navbar";
import Sidebar from "./gardenersidebar/Sidebar";
import { useSidebar } from "./gardenersidebar/SidebarHook";

function GardenerProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentReadyTime, setCurrentReadyTime] = useState(0)
  const [readyTime, setReadyTime] = useState(0);

  const { isOpen, toggle } = useSidebar();

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
    Axios.get("http://localhost:3001/attendanceMarked").then((response) => {
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setMessage(response.data.message);
        setCurrentReadyTime(response.data.result[0].Ready_Time)
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

  const submitAttendance = (event) => {
    event.preventDefault();

    const cd = new Date(Date.now());
    const dateOfWork =
      cd.getFullYear() + "-" + cd.getMonth() + "-" + cd.getDate();

    Axios.post("http://localhost:3001/markAttendance", {
      readyTime: readyTime,
      dateOfWork: dateOfWork,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setError(response.data.message);
      }
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "gardener") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Welcome, {email}</h1>
          <p style={{ color: "#FFF" }}>Current ready time: {currentReadyTime}</p>
          <p style={{ color: "#FFF" }}>{message}</p>
          {currentReadyTime === 0 &&
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Time available</label>
                <input
                  type="number"
                  name="timeavailable"
                  max="24"
                  onChange={(e) => setReadyTime(e.target.value)}
                />
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => submitAttendance(e)}>
                Mark attendance
              </button>
            </div>

            <p style={{ color: "#ed5c49" }}>{error}</p>
          </form>}
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GardenerProfile;
