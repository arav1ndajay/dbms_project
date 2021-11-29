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
function MechanicAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [availableMechanics, setAvailableMechanics] = useState([]);
  const [tools, setTools] = useState([]);
  const { isOpen, toggle } = useSidebar();
  const [detailsToShow, setDetailsToShow] = useState("tools");
  const [toolName, setToolName] = useState("");
  const [MID, setMID] = useState("");
  const [toolToRepair, setToolToRepair] = useState("");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [repairID, setRepairID] = useState("");

  const [usingTools, setUsingTools] = useState([]);
  const [repairingTools, setRepairingTools] = useState([]);

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

    Axios.get("http://localhost:3001/getToolsBeingUsed").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setUsingTools(response.data);
      }
    });

    Axios.get("http://localhost:3001/getToolsBeingRepaired").then(
      (response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setRepairingTools(response.data);
        }
      }
    );
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getTools").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setTools(response.data);
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getPendingPayments").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setPendingPayments(response.data);
      }
    });
  }, []);

  const addTool = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/addTool", {
      toolName: toolName,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getTools").then((response) => {
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setTools(response.data);
          }
        });
      }
    });
  };

  const assignToolToMechanic = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/assignToolToMechanic", {
      toolToRepair: toolToRepair,
      MID: MID,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
      }
    });
  };

  const markAsPaid = (event) => {
    event.preventDefault();

    console.log(repairID);

    Axios.post("http://localhost:3001/markAsPaid", {
      TRID: repairID,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getPendingPayments").then(
          (response) => {
            if (response.data.message) {
              setError(response.data.message);
            } else {
              setPendingPayments(response.data);
            }
          }
        );
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
        {detailsToShow === "tools" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="tools"> Tools </option>
              <option value="assigntool"> Assign tool for repair</option>
              <option value="mechanicpayment"> Mechanic payment </option>
              <option value="toolstatus"> Tool status </option>
            </select>
            <h1>Tools</h1>
            {tools.length > 0 && (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>TID</td>
                    <td>TName</td>
                    <td>Status</td>
                  </tr>
                  {tools.map((t, index) => (
                    <tr key={t.TID}>
                      <td>{t.TID}</td>
                      <td>{t.TName}</td>
                      <td>{t.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <form method="POST">
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Tool name</label>
                  <input
                    type="text"
                    onChange={(e) => setToolName(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <div style={{ marginTop: 0 }} className="button-holder">
              <button onClick={(e) => addTool(e)}>Add tool</button>
            </div>
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        ) : detailsToShow === "assigntool" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="tools"> Tools </option>
              <option value="assigntool"> Assign tool for repair </option>
              <option value="mechanicpayment"> Mechanic payment </option>
              <option value="toolstatus"> Tool status </option>
            </select>
            <h1>Assign tool to mechanic</h1>
            <form>
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Select mechanic</label>
                  <select
                    style={{ fontSize: "20px" }}
                    value={MID}
                    required
                    onChange={(e) => setMID(e.target.value)}
                  >
                    <option value="">Select</option>
                    {availableMechanics.map((m, index) => (
                      <option value={m.MID} key={m.MID}>
                        {m.MID}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-box">
                  <label className="label">Tool to repair</label>
                  <select
                    style={{ fontSize: "20px" }}
                    value={toolToRepair}
                    required
                    onChange={(e) => setToolToRepair(e.target.value)}
                  >
                    <option value="">Select</option>
                    {tools
                      .filter((t) => t.Status === "A")
                      .map((t, index) => (
                        <option value={t.TID} key={t.TID}>
                          {t.TID}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>
            <div className="button-holder">
              <button onClick={(e) => assignToolToMechanic(e)}>
                {" "}
                Assign tool for repair{" "}
              </button>
            </div>
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        ) : detailsToShow === "mechanicpayment" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="tools"> Tools </option>
              <option value="assigntool"> Assign tool for repair </option>
              <option value="mechanicpayment"> Mechanic payment </option>
              <option value="toolstatus"> Tool status </option>
            </select>
            <h1>Pending payments</h1>
            {pendingPayments.length > 0 ? (
              <div>
                <table style={{ border: "1px solid white" }}>
                  <tbody>
                    <tr>
                      <td>TRID</td>
                      <td>TID</td>
                      <td>MID</td>
                      <td>Date finished</td>
                      <td>Amount</td>
                    </tr>
                    {pendingPayments.map((p, index) => (
                      <tr key={p.TRID}>
                        <td>{p.TRID}</td>
                        <td>{p.TID}</td>
                        <td>{p.MID}</td>
                        <td>{p.DateFinished.substring(0, 10)}</td>
                        <td>{p.Amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <form>
                  <div className="inputdetails">
                    <div className="input-box">
                      <label className="label">TRID</label>
                      <select
                        style={{ fontSize: "20px" }}
                        value={repairID}
                        required
                        onChange={(e) => setRepairID(e.target.value)}
                      >
                        <option value="">Select</option>
                        {pendingPayments.map((p, index) => (
                          <option value={p.TRID} key={p.TRID}>
                            {p.TRID}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
                <div className="button-holder">
                  <button onClick={(e) => markAsPaid(e)}> Mark as paid </button>
                </div>
              </div>
            ) : (
              <p>No pending payments.</p>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        ) : (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="tools"> Tools </option>
              <option value="assigntool"> Assign tool for repair </option>
              <option value="mechanicpayment"> Mechanic payment </option>
              <option value="toolstatus"> Tool status </option>
            </select>
            <h1>Tools being used</h1>
            {usingTools.length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>TID</td>
                    <td>GDID</td>
                    <td>Date of use</td>
                  </tr>
                  {usingTools.map((t, index) => (
                    <tr key={t.TID}>
                      <td>{t.TID}</td>
                      <td>{t.GDID}</td>
                      <td>{t.DateUse.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ): <p>No tools being used.</p>}
            <h1>Tools being repaired</h1>
            {repairingTools.length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>TID</td>
                    <td>MID</td>
                    <td>Date of repair</td>
                  </tr>
                  {repairingTools.map((t, index) => (
                    <tr key={t.TID}>
                      <td>{t.TID}</td>
                      <td>{t.MID}</td>
                      <td>{t.DateStarted.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No tools being repaired.</p>}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MechanicAdmin;
