import React from "react";
import "../../../App.css";
import "./mechanicprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./mechanicnav/Navbar";
import Sidebar from "./mechanicsidebar/Sidebar";
import { useSidebar } from "./mechanicsidebar/SidebarHook";
import Loader from "react-loader-spinner";
function MechanicProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [toolsAssigned, setToolsAssigned] = useState([]);

  const [repairedTool, setRepairedTool] = useState("");
  const [amount, setAmount] = useState(0);

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
    Axios.get("http://localhost:3001/toolsAssigned").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setToolsAssigned(response.data);
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

  const markToolAsRepaired = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/markToolAsRepaired", {
      TID: repairedTool,
      amount: amount,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/toolsAssigned").then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setToolsAssigned(response.data);
          }
        });
      }
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
  else if (loginStatus !== "mechanic") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Welcome, {email}</h1>
          <h1>Tools assigned</h1>
          {toolsAssigned.length > 0 ? (
            <div>
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>TID</td>
                    <td>TName</td>
                  </tr>
                  {toolsAssigned.map((t, index) => (
                    <tr key={t.TID}>
                      <td>{t.TID}</td>
                      <td>{t.TName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <form>
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Repaired tool</label>
                    <select
                      style={{ fontSize: "20px" }}
                      value={repairedTool}
                      required
                      onChange={(e) => setRepairedTool(e.target.value)}
                    >
                      <option value="">Select</option>
                      {toolsAssigned.map((t, index) => (
                        <option value={t.TID} key={t.TID}>
                          {t.TID}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <label className="label">Payment amount</label>
                    <input
                      type="text"
                      onChange={(e) => setAmount(e.target.value)}
                    ></input>
                  </div>
                </div>
              </form>
              <div className="button-holder">
                <button onClick={(e) => markToolAsRepaired(e)}>
                  {" "}
                  Mark tool as repaired{" "}
                </button>
              </div>
            </div>
          ): <p>No tools assigned.</p>}
          <p style={{ color: "#ed5c49" }}>{error}</p>
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MechanicProfile;
