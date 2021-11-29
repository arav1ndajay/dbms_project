import React from "react";
import "../../../App.css";
import "./staffprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./staffnav/Navbar";
import Sidebar from "./staffsidebar/Sidebar";
import { useSidebar } from "./staffsidebar/SidebarHook";
import Loader from "react-loader-spinner";
function StaffProfile() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [weeklySchedule, setWeeklySchedule] = useState([]);
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

    const cd = new Date(Date.now());
    const temp = new Date(Date.now())
    const ed = temp.setDate(temp.getDate() + 7);
    const x = new Date(ed);

    const endDate =
      x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate();

    const currentDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    Axios.post("http://localhost:3001/getMyStaffSchedule", {
      startDate: currentDate,
      endDate: endDate,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
      else {
        console.log(response.data);
        setWeeklySchedule(response.data);
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
  else if (loginStatus !== "staff") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Staff Profile</h1>
          <h2>Weekly duty</h2>
          {weeklySchedule.length > 0 && (
            <div>
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>Date</td>
                    <td style={{ textAlign: "center" }}>GHID</td>
                    <td style={{ textAlign: "center" }}>Shift 1</td>
                    <td style={{ textAlign: "center" }}>Shift 2</td>
                  </tr>
                  {weeklySchedule.map((s) => (
                    <tr key={s.Date}>
                      <td>{s.Date.substring(0, 10)}</td>
                      <td>{s.GHID}</td>
                      <td>{s.Shift_1.replace(/ST/g, ",").substring(1)}</td>
                      <td>{s.Shift_2.replace(/ST/g, ",").substring(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default StaffProfile;
