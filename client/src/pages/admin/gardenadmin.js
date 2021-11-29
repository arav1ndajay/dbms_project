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
function GardenAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [weeklyDuty, setWeeklyDuty] = useState([]);
  const [detailsToShow, setDetailsToShow] = useState("weeksSchedule");

  const [dutyHistory, setDutyHistory] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [salaries, setSalaries] = useState([]);

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
    Axios.get("http://localhost:3001/getThisWeeksDuty").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        console.log(response.data);
        setWeeklyDuty(response.data);
      }
    });
  }, []);

  const updateGardenerDutyHistory = (event) => {
    event.preventDefault();

    const cd = new Date(Date.now());
    const currentDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    console.log(weeklyDuty);
    const x = weeklyDuty.reduce((prev, current) => {
      return prev.DateOfDuty > current.DateOfDuty ? prev : current;
    });

    if (currentDate < x.DateOfDuty.substring(0, 10)) {
      setError("Can't log data before last date of weekly duty.");
    } else {
      Axios.get("http://localhost:3001/saveGardenerDutyHistory").then(
        (response) => {
          if (response.data.message) {
            setError(response.data.message);
          }
        }
      );
    }
  };

  const viewDutyHistory = (event) => {
    event.preventDefault();

    if (startDate > endDate || startDate === "" || endDate === "") {
      setError("Please enter valid dates.");
    } else {
      Axios.post("http://localhost:3001/viewDutyHistory", {
        startDate: startDate,
        endDate: endDate,
      }).then((response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          console.log(response.data);
          if (response.data.length === 0)
            setError("No history found on given dates.");
          setDutyHistory(response.data);
        }
      });
    }
  };

  const createWeeklySchedule = (event) => {
    event.preventDefault();

    Axios.get("http://localhost:3001/createWeeklySchedule").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        console.log(response.data);
        setError(response.data.message);
        Axios.get("http://localhost:3001/getThisWeeksDuty").then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            console.log(response.data);
            setWeeklyDuty(response.data);
          }
        });
      }
    });
  };

  const getMonthlySalary = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/getMonthlySalary", {
      year: year,
      month: month,
      hourlyRate: hourlyRate,
    }).then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setSalaries(response.data[0]);
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
        {detailsToShow === "weeksSchedule" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="weeksSchedule"> This week's duty </option>
              <option value="dutyHistory"> Duty History </option>
              <option value="monthlySalary"> Monthly salary </option>
            </select>
            <h1>Weekly Schedule</h1>
            {weeklyDuty.length > 0 ? (
              <div>
              <div style={{overflow: "scroll", maxHeight: "400px"}}>
                <table style={{ border: "1px solid white", overflowY: "scroll", maxHeight: "200px" }}>
                  <tbody>
                    <tr>
                      <td>Date</td>
                      <td>GDID</td>
                      <td>ARID</td>
                      <td>Duty Time</td>
                      <td>Attendance</td>
                    </tr>
                    {weeklyDuty.map((w, index) => (
                      <tr key={w.DateOfDuty + w.GDID + w.ARID}>
                        <td>{w.DateOfDuty.substring(0, 10)}</td>
                        <td>{w.GDID}</td>
                        <td>{w.ARID}</td>
                        <td>{w.dutyTime}</td>
                        <td>{w.Status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="button-holder">
                  <button onClick={(e) => updateGardenerDutyHistory(e)}>
                    {" "}
                    Dump to duty history{" "}
                  </button>
                </div></div>
            ) : (
              <div>
                <p>No duties this week.</p>
                <div className="button-holder">
                  <button onClick={(e) => createWeeklySchedule(e)}>
                    {" "}
                    Create weekly schedule{" "}
                  </button>
                </div>
              </div>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        ) : detailsToShow === "dutyHistory" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="weeksSchedule"> This week's duty </option>
              <option value="dutyHistory"> Duty History </option>
              <option value="monthlySalary"> Monthly salary </option>
            </select>
            <h1>Duty history</h1>
            <form>
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Start date</label>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">End date</label>
                  <input
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => viewDutyHistory(e)}>
                  View duty history
                </button>
              </div>
            </form>
            {dutyHistory.length > 0 && (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>Date</td>
                    <td>GDID</td>
                    <td>ARID</td>
                    <td>Duty Time</td>
                    <td>Attendance</td>
                  </tr>
                  {dutyHistory.map((w, index) => (
                    <tr key={w.DateOfDuty + w.GDID + w.ARID}>
                      <td>{w.DateOfDuty.substring(0, 10)}</td>
                      <td>{w.GDID}</td>
                      <td>{w.ARID}</td>
                      <td>{w.dutyTime}</td>
                      <td>{w.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <option value="weeksSchedule"> This week's duty </option>
              <option value="dutyHistory"> Duty History </option>
              <option value="monthlySalary"> Monthly salary </option>
            </select>
            <h1>Get gardeners' monthly salaries</h1>
            <form>
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Year</label>
                  <input
                    type="number"
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">Month</label>
                  <input
                    type="number"
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">Hourly rate</label>
                  <input
                    type="number"
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => getMonthlySalary(e)}>
                  Get monthly salary
                </button>
              </div>
            </form>
            {salaries.length > 0 && (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>GDID</td>
                    <td>Salary</td>
                  </tr>
                  {salaries.map((s, index) => (
                    <tr key={s.GDID}>
                      <td>{s.GDID}</td>
                      <td>{s.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GardenAdmin;
