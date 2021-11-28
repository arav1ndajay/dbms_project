import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function FoodAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [detailsToShow, setDetailsToShow] = useState("foods");
  const { isOpen, toggle } = useSidebar();
  const [availableFoods, setAvailableFoods] = useState([]);
  const [FName, setFName] = useState("");
  const [price, setPrice] = useState(0);
  const [FID, setFID] = useState("");
  const [orders, setOrders] = useState([]);
  const [FBID, setFBID] = useState("");
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

    Axios.get("http://localhost:3001/getAllOrders").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrders(response.data);
        console.log(response.data);
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
        Axios.get("http://localhost:3001/getAllOrders").then((response) => {
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setOrders(response.data);
          }
        });
      }
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
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
              <option value="foods"> Foods </option>
              <option value="orders"> Food orders </option>
              <option value="foodorderhistory"> History of orders </option>
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
        ) : detailsToShow === "orders" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="foods"> Foods </option>
              <option value="orders"> Food orders </option>
              <option value="foodorderhistory"> History of orders </option>
            </select>
            <h1>Payment pending orders</h1>
            {orders.filter((o) => o.PaymentStatus === 0).length > 0 ? (
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
                  {orders
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
            {orders.filter((o) => o.PaymentStatus === 0).length > 0 && (
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
                      {orders
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
              <option value="foods"> Foods </option>
              <option value="orders"> Food orders </option>
              <option value="foodorderhistory"> History of orders </option>
            </select>
            <h1>History of food orders</h1>
            {orders.filter((o) => o.PaymentStatus === 1).length > 0 ? (
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
                  {orders
                    .filter((o) => o.PaymentStatus === 1)
                    .map((f, index) => (
                      <tr key={f.FBID}>
                        <td>{f.FBID}</td>
                        <td>{f.GID}</td>
                        <td>{f.FID}</td>
                        <td>{f.FName}</td>
                        <td>{f.Quantity}</td>
                        <td>{f.OrderPrice}</td>
                        <td>{f.DateOfOrder.substring(0,10)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No history of orders</p>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodAdmin;
