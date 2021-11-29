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
function FoodAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [detailsToShow, setDetailsToShow] = useState("pendingorders");
  const { isOpen, toggle } = useSidebar();
  const [availableFoods, setAvailableFoods] = useState([]);
  const [FName, setFName] = useState("");
  const [price, setPrice] = useState(0);
  const [FID, setFID] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [unpaidOrders, setUnpaidOrders] = useState([]);

  const [FBID, setFBID] = useState("");

  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
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
    Axios.get("http://localhost:3001/getFoods").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setAvailableFoods(response.data);
      }
    });

    Axios.get("http://localhost:3001/getAllUnpaidOrders").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setUnpaidOrders(response.data);
      }
    });
  }, []);

  const addFood = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/addFood", {
      FName: FName,
      price: price,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getFoods").then((response) => {
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setAvailableFoods(response.data);
          }
        });
      }
    });
  };

  const removeFood = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/removeFood", {
      FID: FID,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getFoods").then((response) => {
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setAvailableFoods(response.data);
          }
        });
      }
    });
  };

  const setAsPaid = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/setOrderAsPaid", {
      FBID: FBID,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getAllUnpaidOrders").then(
          (response) => {
            if (response.data.error) {
              setError(response.data.error);
            } else {
              setUnpaidOrders(response.data);
            }
          }
        );
      }
    });
  };

  const getMonthlyBill = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/getOrdersInAMonth", {
      year: year,
      month: month,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setMonthlyOrders(response.data);
        console.log(response.data);
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
        {detailsToShow === "foods" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="pendingorders"> Pending orders </option>
              <option value="foods"> Foods </option>
              <option value="monthlybill"> Monthly bill </option>
            </select>
            <h1>Foods available</h1>
            {availableFoods.length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>FID</td>
                    <td>FName</td>
                    <td>Price</td>
                  </tr>
                  {availableFoods.map((f, index) => (
                    <tr key={f.FID}>
                      <td>{f.FID}</td>
                      <td>{f.FName}</td>
                      <td>{f.Price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No foods available/updated.</p>
            )}
            <form method="POST">
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Food name</label>
                  <input
                    type="text"
                    onChange={(e) => setFName(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label className="label">Price</label>
                  <input
                    type="text"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <div style={{ marginTop: 0 }} className="button-holder">
              <button onClick={(e) => addFood(e)}>Add food</button>
            </div>
            {availableFoods.length > 0 && (
              <form>
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Food to remove </label>
                    <select
                      style={{ fontSize: "20px" }}
                      value={FID}
                      required
                      onChange={(e) => setFID(e.target.value)}
                    >
                      <option value="">Select</option>
                      {availableFoods.map((f, index) => (
                        <option value={f.FID} key={f.FID}>
                          {f.FID}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {FID !== "" && (
                  <div className="button-holder">
                    <button onClick={(e) => removeFood(e)}> Remove food</button>
                  </div>
                )}
              </form>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        ) : detailsToShow === "pendingorders" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="pendingorders"> Pending orders </option>
              <option value="foods"> Foods </option>
              <option value="monthlybill"> Monthly bill </option>
            </select>
            <h1>Payment pending orders</h1>
            {unpaidOrders.length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>FBID</td>
                    <td>GID</td>
                    <td>FID</td>
                    <td>FName</td>
                    <td>Quantity</td>
                    <td>Order Price</td>
                  </tr>
                  {unpaidOrders
                    .filter((o) => o.PaymentStatus === 0)
                    .map((f, index) => (
                      <tr key={f.FBID}>
                        <td>{f.FBID}</td>
                        <td>{f.GID}</td>
                        <td>{f.FID}</td>
                        <td>{f.FName}</td>
                        <td>{f.Quantity}</td>
                        <td>{f.OrderPrice}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No pending orders.</p>
            )}
            {unpaidOrders.length > 0 && (
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">FBID to set as paid</label>
                    <select
                      style={{ fontSize: "20px" }}
                      value={FBID}
                      required
                      onChange={(e) => setFBID(e.target.value)}
                    >
                      <option value="">Select</option>
                      {unpaidOrders
                        .filter((o) => o.PaymentStatus === 0)
                        .map((f, index) => (
                          <option value={f.FBID} key={f.FBID}>
                            {f.FBID}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 0 }} className="button-holder">
                  <button onClick={(e) => setAsPaid(e)}>Set as paid</button>
                </div>
              </form>
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
              <option value="pendingorders"> Pending orders </option>
              <option value="foods"> Foods </option>
              <option value="monthlybill"> Monthly bill </option>
            </select>
            <h1>Monthly bill</h1>
            <form method="POST">
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
              </div>
              <div style={{ marginTop: 0 }} className="button-holder">
                <button onClick={(e) => getMonthlyBill(e)}>
                  Get monthly bill
                </button>
              </div>
            </form>
            {monthlyOrders.length > 0 && (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>FBID</td>
                    <td>GID</td>
                    <td>FID</td>
                    <td>FName</td>
                    <td>Quantity</td>
                    <td>Order Price</td>
                    <td>Date of order</td>
                  </tr>
                  {monthlyOrders.map((f, index) => (
                    <tr key={f.FBID}>
                      <td>{f.FBID}</td>
                      <td>{f.GID}</td>
                      <td>{f.FID}</td>
                      <td>{f.FName}</td>
                      <td>{f.Quantity}</td>
                      <td>{f.OrderPrice}</td>
                      <td>{f.DateOfOrder.substring(0, 10)}</td>
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

export default FoodAdmin;
