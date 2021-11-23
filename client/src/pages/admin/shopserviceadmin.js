import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function ShopServiceAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopMessage, setShopMessage] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [shopArea, setShopArea] = useState("");
  const [rent, setRent] = useState(0);

  const [unassignedShopkeepers, setUnassignedShopkeepers] = useState([]);
  const [unassignedShops, setUnassignedShops] = useState([]);

  const [skToAssign, setSkToAssign] = useState("");
  const [shToAssign, setShToAssign] = useState("");
  const [licensePeriod, setLicensePeriod] = useState(0);

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
    Axios.get("http://localhost:3001/getUnassignedShopkeepers").then(
      (response) => {
        if (response.data.message) {
          setError(response.data.message);
        } else {
          console.log(response.data);
          setUnassignedShopkeepers(response.data);
        }
      }
    );
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getUnassignedShops").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        console.log(response.data);
        setUnassignedShops(response.data);
      }
    });
  }, []);

  const addShop = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/addShop", {
      shopArea: shopArea,
      rent: rent,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setShopMessage(response.data.message);
      }
    });
  };

  const assignShop = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/assignShopkeeper", {
      SKID: skToAssign,
      SHID: shToAssign,
      LicensePeriod: licensePeriod,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setAssignMessage(response.data.message);
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
        <div className="box">
          <h1 style={{ marginBottom: "0" }}>Welcome to shop services</h1>
          <form method="POST">
            <div className="inputdetails">
              <h1>Add new shop</h1>
              <div className="input-box">
                <label className="label">Shop area</label>
                <input
                  type="text"
                  name="shoparea"
                  onChange={(e) => setShopArea(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label className="label">Rent</label>
                <input
                  type="number"
                  name="rent"
                  onChange={(e) => setRent(e.target.value)}
                />
              </div>

              <div className="button-holder">
                <button onClick={(e) => addShop(e)}>Add shop</button>
              </div>

              <p style={{ color: "#ed5c49" }}>{shopMessage}</p>
              {/* </form> */}
              <h1>Assign shop to keeper</h1>
              {/* <form method="POST"> */}

              <div className="input-box">
                <label className="label">Shopkeeper ID</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={skToAssign}
                  required
                  onChange={(e) => setSkToAssign(e.target.value)}
                >
                  <option value="">Select</option>
                  {unassignedShopkeepers.map((sk, index) => (
                    <option value={sk.SKID} key={sk.SKID}>
                      {sk.SKID}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-box">
                <label className="label">Shop ID</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={shToAssign}
                  required
                  onChange={(e) => setShToAssign(e.target.value)}
                >
                  <option value="">Select</option>
                  {unassignedShops.map((sh, index) => (
                    <option value={sh.SHID} key={sh.SHID}>
                      {sh.SHID}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-box">
                <label className="label">License period</label>
                <input
                  type="number"
                  name="licenseperiod"
                  onChange={(e) => setLicensePeriod(e.target.value)}
                />
              </div>

              <div className="button-holder">
                <button onClick={(e) => assignShop(e)}>Assign shop</button>
              </div>
            </div>
            <p style={{ color: "#ed5c49" }}>{assignMessage}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShopServiceAdmin;
