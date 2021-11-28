import React from "react";
import "../../../App.css";
import "./gardenerprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./gardenernav/Navbar";
import Sidebar from "./gardenersidebar/Sidebar";
import { useSidebar } from "./gardenersidebar/SidebarHook";

function GardenerTools() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [availableTools, setAvailableTools] = useState([]);
  const [usingTools, setUsingTools] = useState([]);

  const [toolToUse, setToolToUse] = useState("");
  const [toolToReturn, setToolToReturn] = useState("");
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
    Axios.get("http://localhost:3001/getAvailableTools").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAvailableTools(response.data);
      }
    });

    Axios.get("http://localhost:3001/getUsingTools").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setUsingTools(response.data);
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

  const selectTool = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/setGardenerTool", {
      TID: toolToUse,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getAvailableTools").then(
          (response) => {
            if (response.data.error) {
              setError(response.data.error);
            } else {
              setAvailableTools(response.data);
            }
          }
        );

        Axios.get("http://localhost:3001/getUsingTools").then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setUsingTools(response.data);
          }
        });
      }
    });
  };

  const returnTool = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/returnTool", {
      TID: toolToReturn,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getAvailableTools").then(
          (response) => {
            if (response.data.error) {
              setError(response.data.error);
            } else {
              setAvailableTools(response.data);
            }
          }
        );

        Axios.get("http://localhost:3001/getUsingTools").then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setUsingTools(response.data);
          }
        });
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
          <h1> Tools available </h1>
          {availableTools.length > 0 && (
            <table style={{ border: "1px solid white" }}>
              <tbody>
                <tr>
                  <td>TID</td>
                  <td>TName</td>
                </tr>
                {availableTools.map((t, index) => (
                  <tr key={t.TID}>
                    <td>{t.TID}</td>
                    <td>{t.TName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {availableTools.length > 0 && (
            <form>
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Tool to use </label>
                  <select
                    style={{ fontSize: "20px" }}
                    value={toolToUse}
                    required
                    onChange={(e) => setToolToUse(e.target.value)}
                  >
                    <option value="">Select</option>
                    {availableTools.map((t, index) => (
                      <option value={t.TID} key={t.TID}>
                        {t.TID}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => selectTool(e)}>
                  {" "}
                  Select tool for use
                </button>
              </div>
            </form>
          )}
          {usingTools.length > 0 && (
            <form>
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Tool to return </label>
                  <select
                    style={{ fontSize: "20px" }}
                    value={toolToReturn}
                    required
                    onChange={(e) => setToolToReturn(e.target.value)}
                  >
                    <option value="">Select</option>
                    {usingTools.map((t, index) => (
                      <option value={t.TID} key={t.TID}>
                        {t.TID}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => returnTool(e)}> Return tool</button>
              </div>
            </form>
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

export default GardenerTools;
