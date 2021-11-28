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
  const [weeklyDuty, setWeeklyDuty] = useState([]);
  const [todaysDuty, setTodaysDuty] = useState([]);
  const [isChecked, setIsChecked] = useState(false)
  const { isOpen, toggle } = useSidebar();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);

        Axios.post("http://localhost:3001/getThisWeeksDuty", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setMessage(response.data.message);
            console.log(response.data);
            setWeeklyDuty(response.data);

            const cd = new Date(Date.now());
            const currentDate =
              cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

            for (let i = 0; i < response.data.length; i++) {
              console.log(currentDate);
              if (
                currentDate === response.data[i].DateOfDuty.substring(0, 10)
              ) {
                setTodaysDuty((t) => [...t, response.data[i]]);
              }
            }
          }
        });

        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
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

  const markAttendance = (event) => {
    event.preventDefault();

    setIsChecked(true)

    const cd = new Date(Date.now());
    const dateOfDuty =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    Axios.post("http://localhost:3001/markAttendance", {
      dateOfDuty: dateOfDuty,
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
          <h1> Today's duty </h1>
          {todaysDuty.length > 0 && (
            <table style={{ border: "1px solid white" }}>
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>ARID</td>
                  <td>Duty Time</td>
                  <td>Attendance</td>
                </tr>
                {todaysDuty.map((w, index) => (
                  <tr key={w.DateOfDuty + w.ARID}>
                    <td>{w.DateOfDuty.substring(0, 10)}</td>
                    <td>{w.ARID}</td>
                    <td>{w.dutyTime}</td>
                    <td><input
                      type="checkbox"
                      checked={isChecked}
                      disabled={w.Status === "P" ? true : false}
                      onChange={(e) => markAttendance(e)}
                    ></input></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h1>This week's duty</h1>
          {weeklyDuty.length > 0 && (
            <table style={{ border: "1px solid white" }}>
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>ARID</td>
                  <td>Duty Time</td>
                  <td>Status</td>
                </tr>
                {weeklyDuty.map((w, index) => (
                  <tr key={w.DateOfDuty + w.ARID}>
                    <td>{w.DateOfDuty.substring(0, 10)}</td>
                    <td>{w.ARID}</td>
                    <td>{w.dutyTime}</td>
                    <td>{w.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p style={{ color: "#ed5c49" }}>{error}</p>

          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GardenerProfile;
