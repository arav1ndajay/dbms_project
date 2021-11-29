import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";
import Loader from "react-loader-spinner";

function AreaRequestAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [areaType, setAreaType] = useState("");
  const [areaTime, setAreaTime] = useState(0);
  const [areasNotRequested, setAreasNotRequested] = useState([]);
  const [areaMessage, setAreaMessage] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [areaToRequest, setAreaToRequest] = useState("");

  const [error, setError] = useState("");

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
    Axios.get("http://localhost:3001/areasNotRequested").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        console.log(response.data);
        setAreasNotRequested(response.data);
      }
    });
  }, []);

  const addArea = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/addArea", {
      areaType: areaType,
      areaTime: areaTime,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setAreaMessage(response.data.message);
      }
    });
  };

  const createRequest = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/createRequest", {
      areaID: areaToRequest,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setReqMessage(response.data.message);
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
  else if (loginStatus !== "admin") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Create new gardening request</h1>
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">AreaID for request</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={areaToRequest}
                  required
                  onChange={(e) => setAreaToRequest(e.target.value)}
                >
                  <option value="">Select</option>
                  {areasNotRequested.map((area, index) => (
                    <option value={area.ARID} key={area.ARID}>
                      {area.ARID}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => createRequest(e)}>Create request</button>
            </div>

            <p style={{ color: "#ed5c49" }}>{reqMessage}</p>
          </form>
          <h1>Add new area</h1>
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Area type</label>
                <input
                  type="text"
                  name="areatype"
                  onChange={(e) => setAreaType(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label className="label">Area time</label>
                <input
                  type="number"
                  name="areatime"
                  onChange={(e) => setAreaTime(e.target.value)}
                />
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => addArea(e)}>Add area</button>
            </div>

            <p style={{ color: "#ed5c49" }}>{areaMessage}</p>
          </form>
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default AreaRequestAdmin;
