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
function RoomAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [roomDetailsLoading, setRoomDetailsLoading] = useState(true);
  const [pendingRooms, setPendingRooms] = useState([]);
  const [error, setError] = useState("");
  const [detailsToShow, setDetailsToShow] = useState(
    "pendingandmonthlybookings"
  );

  // for getting monthly bookings
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [category, setCategory] = useState("X");
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const { isOpen, toggle } = useSidebar();

  const [roomsToApprove, setRoomsToApprove] = useState(
    new Array(pendingRooms.length).fill(false)
  );

  // for monthly expenditure generation
  const [expYear, setExpYear] = useState(0);
  const [expMonth, setExpMonth] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [GHID, setGHID] = useState("");
  const [availableGHIDs, setAvailableGHIDs] = useState([]);

  const [expenditure, setExpenditure] = useState([]);

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
    if (loginStatus === "admin") {
      setRoomDetailsLoading(true);

      Axios.get("http://localhost:3001/pendingRooms").then((response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setPendingRooms(response.data);
          setRoomDetailsLoading(false);
        }
      });
    }
  }, [loginStatus]);

  //for getting all GHIDs with rooms
  useEffect(() => {
    Axios.get("http://localhost:3001/getGHIDs").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setAvailableGHIDs(response.data);
      }
    });
  }, []);

  const handleCheck = (roomID) => {
    if (roomsToApprove.indexOf(roomID) === -1)
      setRoomsToApprove([...roomsToApprove, roomID]);
    else {
      setRoomsToApprove(roomsToApprove.filter((tempid) => tempid !== roomID));
    }
  };

  const approveRooms = (event) => {
    event.preventDefault();

    setRoomDetailsLoading(true);

    Axios.post("http://localhost:3001/approveRooms", {
      roomsToApprove: roomsToApprove,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);

      const newRooms = pendingRooms.filter(
        (room) => roomsToApprove.indexOf(room.RoomID) === -1
      );

      setRoomsToApprove([]);

      setPendingRooms(newRooms);

      setRoomDetailsLoading(false);

      console.log(response.data);
    });
  };

  const getMonthlyBookings = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/getMonthlyBookings", {
      year: year,
      month: month,
      category: category,
    }).then((response) => {
      if (response.data.error) setError(response.data.message);
      else {
        console.log(response.data);
        if (response.data.length === 0)
          setError("No monthly bookings found for given data.");
        else setMonthlyBookings(response.data);
      }
    });
  };

  const generateExpenditure = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/generateExpenditure", {
      year: expYear,
      month: expMonth,
      GHID: GHID,
      billamount: billAmount,
    }).then((response) => {
      if (response.data.error) setError(response.data.error);
      else {
        setError(response.data.message);
      }
    });
  };

  const viewExpenditure = (event) => {
    event.preventDefault();

    if (expYear === "" || expMonth === "" || GHID === "") {
      setError("Please enter required fields.");
    } else {
      Axios.post("http://localhost:3001/viewExpenditure", {
        year: expYear,
        month: expMonth,
        GHID: GHID,
      }).then((response) => {
        if (response.data.error) setError(response.data.message);
        else {
          console.log(response.data);
          if (response.data.length === 0) setError("No expenditure generated.");
          setExpenditure(response.data);
        }
      });
    }
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
        {detailsToShow === "pendingandmonthlybookings" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="pendingandmonthlybookings">
                Pending/monthly bookings
              </option>
              <option value="expenditures"> Expenditures </option>
            </select>
            <h1>Pending Room Bookings</h1>
            {roomDetailsLoading ? (
              <div>Loading...</div>
            ) : pendingRooms.length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>RBID</td>
                    <td>RoomID</td>
                    <td>GID</td>
                    <td>Date of Booking</td>
                    <td>Price</td>
                    <td>Approve</td>
                  </tr>
                  {pendingRooms.map((room, index) => (
                    <tr key={room.RBID}>
                      <td>{room.RBID}</td>
                      <td>{room.RoomID}</td>
                      <td>{room.GID}</td>
                      <td>{room.DateOfBooking.substring(0, 10)}</td>
                      <td>{room.Price}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={
                            roomsToApprove.indexOf(room.RoomID) === -1
                              ? false
                              : true
                          }
                          onChange={() => handleCheck(room.RoomID)}
                        ></input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No pending room booking requets.</div>
            )}
            {roomsToApprove.length > 0 && (
              <button onClick={(e) => approveRooms(e)}> Approve rooms </button>
            )}
            <h1>Monthly bookings</h1>
            <form method="POST">
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Year</label>
                  <input
                    type="number"
                    placeholder="Enter year"
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">Month</label>
                  <input
                    type="number"
                    placeholder="Enter month"
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">Category</label>
                  <select
                    style={{ fontSize: "20px", marginTop: "10px" }}
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="X">X</option>
                    <option value="Y">Y</option>
                    <option value="Z">Z</option>
                  </select>
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => getMonthlyBookings(e)}>
                  Get monthly bookings
                </button>
              </div>
              <p style={{ color: "#ed5c49" }}>{error}</p>
            </form>
            {monthlyBookings.length > 0 && (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>RBID</td>
                    <td>RoomID</td>
                    <td>GID</td>
                    <td>Date of Booking</td>
                    <td>Payment</td>
                  </tr>
                  {monthlyBookings.map((room, index) => (
                    <tr key={room.RBID}>
                      <td>{room.RBID}</td>
                      <td>{room.RoomID}</td>
                      <td>{room.GID}</td>
                      <td>{room.DateOfBooking.substring(0, 10)}</td>
                      <td>{room.Price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          detailsToShow === "expenditures" && (
            <div className="box">
              <select
                style={{ fontSize: "20px", marginTop: "10px" }}
                value={detailsToShow}
                required
                onChange={(e) => setDetailsToShow(e.target.value)}
              >
                <option value="pendingandmonthlybookings">
                  Pending/monthly bookings
                </option>
                <option value="expenditures"> Expenditures </option>
              </select>
              <h1>View monthly expenditure / generate expenditure</h1>
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">GHID</label>
                    <select
                      style={{ fontSize: "20px", marginTop: "10px" }}
                      value={GHID}
                      required
                      onChange={(e) => setGHID(e.target.value)}
                    >
                      <option value="">Select</option>
                      {availableGHIDs.map((g) => (
                        <option key={g.GHID} value={g.GHID}>
                          {g.GHID}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <label className="label">Year</label>
                    <input
                      type="number"
                      placeholder="Enter year"
                      onChange={(e) => setExpYear(e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label className="label">Month</label>
                    <input
                      type="number"
                      placeholder="Enter month"
                      onChange={(e) => setExpMonth(e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label className="label">
                      Total bill amount (electricity/water)
                    </label>
                    <input
                      type="number"
                      placeholder="Fill for generating expenditure only"
                      onChange={(e) => setBillAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  className="button-holder"
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <button
                    onClick={(e) => generateExpenditure(e)}
                    style={{ maxWidth: "fit-content" }}
                  >
                    Generate expenditure
                  </button>
                  <button onClick={(e) => viewExpenditure(e)}>
                    View expenditure
                  </button>
                </div>
              </form>
              {expenditure.length > 0 && (
                <table style={{ border: "1px solid white" }}>
                  <tbody>
                    <tr>
                      <td>GHID</td>
                      <td>Total Salary</td>
                      <td>Total Room Costs</td>
                      <td>Other Bills</td>
                      <td>Total expenditure</td>
                    </tr>
                    {expenditure.map((e, index) => (
                      <tr key={e.Year + e.Month + e.GHID}>
                        <td>{e.GHID}</td>
                        <td>{e.TotalSalaryPaid}</td>
                        <td>{e.TotalRoomCosts}</td>
                        <td>{e.OtherBills}</td>
                        <td>
                          {e.TotalSalaryPaid + e.TotalRoomCosts + e.OtherBills}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p style={{ color: "#ed5c49" }}>{error}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default RoomAdmin;
