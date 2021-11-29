import React from "react";
import "../../../App.css";
import "./guestprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./guestnav/Navbar";
import Sidebar from "./guestsidebar/Sidebar";
import { useSidebar } from "./guestsidebar/SidebarHook";
import Loader from "react-loader-spinner";
function OrderFood() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [detailsToShow, setDetailsToShow] = useState("orderfood");
  const { isOpen, toggle } = useSidebar();
  const [availableFoods, setAvailableFoods] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);

  const [FID, setFID] = useState("");

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

    Axios.get("http://localhost:3001/getOrders").then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrders(response.data);
      }
    });
  }, []);

  const orderFood = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/orderFood", {
      FID: FID,
      quantity: quantity,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.message);
        Axios.get("http://localhost:3001/getOrders").then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setOrders(response.data);
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
  else if (loginStatus !== "guest") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        {detailsToShow === "orderfood" ? (
          <div className="box">
            <select
              style={{ fontSize: "20px", marginTop: "10px" }}
              value={detailsToShow}
              required
              onChange={(e) => setDetailsToShow(e.target.value)}
            >
              <option value="orderfood"> Order food </option>
              <option value="pastorders"> Past orders </option>
            </select>
            <h1>Order Food</h1>
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
              <p>No foods available.</p>
            )}
            {availableFoods.length > 0 && (
              <form>
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Food to order </label>
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
                  <div className="input-box">
                    <label className="label">Quantity</label>
                    <input
                      type="number"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>
                {FID !== "" && quantity !== 0 && quantity !== "" && (
                  <div className="button-holder">
                    <button onClick={(e) => orderFood(e)}> Order food</button>
                  </div>
                )}
              </form>
            )}
            <h1>Payment pending orders</h1>
            {orders.filter((o) => o.PaymentStatus === 0).length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>FBID</td>
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
              <option value="orderfood"> Order food </option>
              <option value="pastorders"> Past orders </option>
            </select>
            <h1>Past bills</h1>
            {orders.filter((o) => o.PaymentStatus === 1).length > 0 ? (
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td>FBID</td>
                    <td>FID</td>
                    <td>FName</td>
                    <td>Quantity</td>
                    <td>Order Price</td>
                  </tr>
                  {orders
                    .filter((o) => o.PaymentStatus === 1)
                    .map((f, index) => (
                      <tr key={f.FBID}>
                        <td>{f.FBID}</td>
                        <td>{f.FID}</td>
                        <td>{f.FName}</td>
                        <td>{f.Quantity}</td>
                        <td>{f.OrderPrice}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No past orders.</p>
            )}
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderFood;
