import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function MechanicAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [availableMechanics, setAvailableMechanics] = useState([]);

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
    Axios.get("http://localhost:3001/getAvailableMechanics").then(
      (response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setAvailableMechanics(response.data);
        }
      }
    );
  }, []);

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "admin") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Available Mechanics</h1>
          {availableMechanics.length > 0 ? (
            <table>
              <tbody>
                <tr>
                  <td>MID</td>
                  <td>MName</td>
                  <td>ContactNum</td>
                  <td>DOB</td>
                  <td>Email</td>
                </tr>
                {availableMechanics.map((mech, index) => (
                  <tr key={mech.MID}>
                    <td>{mech.MID}</td>
                    <td>{mech.MName}</td>
                    <td>{mech.ContactNum}</td>
                    {/* <td>{mech.DateOfBooking.substring(0, 10)}</td> */}
                    <td>{mech.DOB.substring(0,10)}</td>
                    <td>{mech.Email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No available mechanics</div>
          )}
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default MechanicAdmin;
