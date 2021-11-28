import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect, useRef } from "react";
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
  const [detailsToShow, setDetailsToShow] = useState("staffscheduler");
  const [staffDetails, setStaffDetails] = useState([]);
  const [shift, setShift] = useState("Shift_1");
  const [staffString, setStaffString] = useState("");
  const [dateToUpdate, setDateToUpdate] = useState("");
  const [dataLogged, setDataLogged] = useState(false);
  const loggedWeeks = useRef([]);
  const [loggedData, setLoggedData] = useState([]);
  const [weekToViewLog, setWeekToViewLog] = useState("");
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

  // check if current schedule has been logged, and also set logged dates
  useEffect(() => {
    Axios.get("http://localhost:3001/getLoggedDates").then((response) => {
      if (response.data.message) setError(response.data.message);
      else {
        console.log(response.data);

        for (let i = 0; i < response.data.length; i += 7) {
          const item = {
            startDate: response.data[i].Date.substring(0, 10),
            endDate: response.data[i + 6].Date.substring(0, 10),
          };
          loggedWeeks.current.push(item);
        }

        const cd = new Date(Date.now());
        const currentDate =
          cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

        if (
          loggedWeeks.current.length > 0 &&
          !(
            currentDate >
            loggedWeeks.current[loggedWeeks.current.length - 1].endDate
          )
        )
          setDataLogged(true);
        console.log(currentDate);
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

  // useEffect(() => {
  //   setScheduleLoading(true);

  //   const cd = new Date(Date.now());
  //   const currentDate =
  //     cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

  //   Axios.post("http://localhost:3001/getLoggedData", {
  //     startDate: currentDate,
  //     endDate: currentDate,
  //   }).then((response) => {
  //     if (response.data.message) setError(response.data.message);
  //     else {
  //       console.log(response.data);
  //       setDataIsLogged(true);
  //     }
  //   });
  // }, []);

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
        shift: shift,
      }).then((response) => {
        if (response.data.message) setUpdateError(response.data.message);
        else setUpdateError("Schedule updated successfully.");

        setWeeklySchedule(response.data);

        setScheduleLoading(false);

        console.log(response.data);
      });
    }
  };

  const getLoggedData = (event) => {
    event.preventDefault();

    if (weekToViewLog === "") {
      setError("Please select valid week.");
    } else {
      Axios.post("http://localhost:3001/getLoggedData", {
        startDate: weekToViewLog.substring(0, 10),
        endDate: weekToViewLog.substring(11),
      }).then((response) => {
        if (response.data.message) setError(response.data.message);
        else {
          console.log(response.data);
          setLoggedData(response.data);
        }
      });
    }
  };

  const fixSchedule = (event) => {
    event.preventDefault();

    Axios.get("http://localhost:3001/fixSchedule").then((response) => {
      if (response.data.error) setError(response.data.message);
      else {
        setError(response.data.message);

        setScheduleLoading(true);
        Axios.get("http://localhost:3001/getWeeklySchedule").then(
          (response) => {
            if (response.data.message) setError(response.data.message);

            setWeeklySchedule(response.data);
            setDataLogged(true);

            setScheduleLoading(false);
          }
        );
      }
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
        {detailsToShow === "staffdetails" ? (
          <div className="adminBox">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="staffscheduler"> Staff scheduler </option>
              <option value="staffdutylog"> Duty Log </option>
              <option value="staffdetails"> Staff details </option>
            </select>
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
        ) : detailsToShow === "staffscheduler" ? (
          <div className="adminBox">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="staffscheduler"> Staff scheduler </option>
              <option value="staffdutylog"> Duty Log </option>
              <option value="staffdetails"> Staff details </option>
            </select>
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
                      Log this schedule
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
            ) : dataLogged ? (
              <p>
                Data is logged for this week. Please check logs for schedule.
              </p>
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
        ) : (
          <div className="adminBox">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="staffscheduler"> Staff scheduler </option>
              <option value="staffdutylog"> Duty Log </option>
              <option value="staffdetails"> Staff details </option>
            </select>
            <div>
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label" style={{ marginTop: "10px" }}>
                      Week of log
                    </label>
                    <select
                      style={{ fontSize: "20px" }}
                      value={weekToViewLog}
                      required
                      onChange={(e) => setWeekToViewLog(e.target.value)}
                    >
                      <option value=""> Select week </option>
                      {loggedWeeks.current.map((s, index) => (
                        <option
                          key={s.startDate}
                          value={s.startDate + "-" + s.endDate}
                        >
                          {s.startDate} to {s.endDate}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="button-holder">
                  <button onClick={(e) => getLoggedData(e)}>
                    Get duty log
                  </button>
                </div>
                <p style={{ color: "#ed5c49" }}>{updateError}</p>
              </form>
            </div>
            {loggedData.length > 0 && (
              <div>
                <table style={{ border: "1px solid white" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>Date</td>
                      <td style={{ textAlign: "center" }}>GHID</td>
                      <td style={{ textAlign: "center" }}>Shift 1</td>
                      <td style={{ textAlign: "center" }}>Shift 2</td>
                    </tr>
                    {loggedData.map((s, index) => (
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
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffAdmin;
