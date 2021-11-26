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
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [showEditDialog, setShowEditDialogue] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [staffDetails, setStaffDetails] = useState([]);
  const [shift, setShift] = useState("Shift_1");
  const [staffString, setStaffString] = useState("");
  const [dateToUpdate, setDateToUpdate] = useState("");
  const [dataLogged, setDataLogged] = useState(false)

  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

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
    setScheduleLoading(true);

    Axios.get("http://localhost:3001/getWeeklySchedule").then((response) => {
      if (response.data.message) setError(response.data.message);

      setWeeklySchedule(response.data);

      setScheduleLoading(false);
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getStaffDetails").then((response) => {
      if (response.data.message) setError(response.data.message);

      setStaffDetails(response.data);
    });
  }, []);

  // const getWeeklySchedule = (event) => {
  //   event.preventDefault();

  //   setScheduleLoading(true);

  //   Axios.get("http://localhost:3001/getWeeklySchedule").then((response) => {
  //     if (response.data.message) setError(response.data.message);

  //     setScheduleLoading(weeklySchedule);

  //     setScheduleLoading(false);

  //     console.log(response.data);
  //   });
  // };

  const generateStaffSchedule = (event) => {
    event.preventDefault();

    setScheduleLoading(true);

    Axios.get("http://localhost:3001/generateStaffSchedule").then(
      (response) => {
        if (response.data.message) setError(response.data.message);

        setWeeklySchedule(response.data);

        setScheduleLoading(false);

        console.log(response.data);
      }
    );
  };

  const updateSchedule = (event) => {
    event.preventDefault();

    if (dateToUpdate === "" || staffString === "") {
      setUpdateError("Empty fields detected.");
    } else {
      setScheduleLoading(true);
      Axios.post("http://localhost:3001/updateStaffSchedule", {
        staffString: staffString,
        dateToUpdate: dateToUpdate,
        shift: shift
      }).then((response) => {
        if (response.data.message) setUpdateError(response.data.message);
        else setUpdateError("Schedule updated successfully.")
        
        setWeeklySchedule(response.data);

        setScheduleLoading(false);

        console.log(response.data);
      });
    }
  };

  const fixSchedule = (event) => {
    event.preventDefault();

    Axios.get("http://localhost:3001/fixSchedule").then((response) => {
      
    if (response.data.message) setError(response.data.message);

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
        {showStaffDetails ? (
          <div className="adminBox">
            <div className="button-holder">
              <button onClick={(e) => setShowStaffDetails(!showStaffDetails)}>
                {showStaffDetails
                  ? "Show staff scheduler"
                  : "Show staff details"}
              </button>
            </div>
            <h1>Staff details</h1>
            {staffDetails.length > 0 ? (
              <table>
                <tbody>
                  <tr>
                    <td>STID</td>
                    <td>STName</td>
                    <td>Contact Number</td>
                    <td>Staff Type</td>
                  </tr>
                  {staffDetails.map((st, index) => (
                    <tr key={st.STID}>
                      <td>{st.STID}</td>
                      <td>{st.STName}</td>
                      <td>{st.ContactNum}</td>
                      <td>{st.SType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No staff available</p>
            )}
          </div>
        ) : (
          <div className="adminBox">
            <div className="button-holder">
              <button onClick={(e) => setShowStaffDetails(!showStaffDetails)}>
                {showStaffDetails
                  ? "Show staff scheduler"
                  : "Show staff details"}
              </button>
            </div>
            <h1>Staff Scheduler</h1>
            <h2>This week's schedule</h2>
            {scheduleLoading ? (
              <div>Loading...</div>
            ) : weeklySchedule.length > 0 ? (
              <div>
                <table style={{ border: "1px solid white" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>Date</td>
                      <td style={{ textAlign: "center" }}>GHID</td>
                      <td style={{ textAlign: "center" }}>Shift 1</td>
                      <td style={{ textAlign: "center" }}>Shift 2</td>
                    </tr>
                    {weeklySchedule.map((s, index) => (
                      <tr key={s.Date}>
                        <td>{s.Date.substring(0, 10)}</td>
                        <td>{s.GHID}</td>
                        <td>{s.Shift_1.replace(/ST/g, ",").substring(1)}</td>
                        <td>{s.Shift_2.replace(/ST/g, ",").substring(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="button-holder">
                  <button onClick={(e) => setShowEditDialogue(!showEditDialog)}>
                    {showEditDialog ? "Cancel edit" : "Edit schedule"}
                  </button>
                </div>
                {!showEditDialog && (
                  <div className="button-holder">
                    <button onClick={(e) => fixSchedule(e)}>
                      Fix and log schedule
                    </button>
                  </div>
                )}
                {showEditDialog && (
                  <form method="POST">
                    <div className="inputdetails">
                      <div className="input-box">
                        <label className="label" style={{ margin: 0 }}>
                          Shift
                        </label>
                        <div style={{ display: "flex", margin: "0px" }}>
                          <input
                            type="checkbox"
                            checked={shift === "Shift_1" ? true : false}
                            onChange={() => setShift("Shift_1")}
                          ></input>
                          <p>Shift 1</p>
                          <input
                            type="checkbox"
                            checked={shift === "Shift_2" ? true : false}
                            onChange={() => setShift("Shift_2")}
                          ></input>
                          <p>Shift 2</p>
                        </div>
                      </div>
                      <div className="input-box">
                        <label className="label">Date to update</label>
                        <select
                          style={{ fontSize: "20px" }}
                          value={dateToUpdate}
                          required
                          onChange={(e) => setDateToUpdate(e.target.value)}
                        >
                          <option value=""> Select date </option>
                          {weeklySchedule.map((s, index) => (
                            <option
                              key={s.Date.substring(0, 10)}
                              value={s.Date.substring(0, 10)}
                            >
                              {s.Date.substring(0, 10)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-box">
                        <label className="label">New staff string</label>
                        <input
                          type="text"
                          name="staffstring"
                          onChange={(e) => setStaffString(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-holder">
                      <button onClick={(e) => updateSchedule(e)}>
                        Update schedule
                      </button>
                    </div>
                    <p style={{ color: "#ed5c49" }}>{updateError}</p>
                  </form>
                )}
              </div>
            ) : (
              <div>
                <div>No schedule for this week</div>
                <div className="button-holder">
                  <button onClick={(e) => generateStaffSchedule(e)}>
                    Generate weekly schedule
                  </button>
                </div>
              </div>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffAdmin;
