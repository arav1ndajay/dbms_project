import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function PaymentsAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopkeepers, setShopkeepers] = useState([]);
  const [payingShopkeeper, setPayingShopkeeper] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [extensionRequests, setExtensionRequests] = useState([]);
  const [extensionPeriod, setExtensionPeriod] = useState(0);
  const [shopkeeperToExtend, setShopkeeperToExtend] = useState("");
  const [depositMessage, setDepositMessage] = useState("");
  const [error, setError] = useState("");
  const [extensionError, setExtensionError] = useState("");

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
    Axios.get("http://localhost:3001/getShopkeepers").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setShopkeepers(response.data);
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getExtensionRequests").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setExtensionRequests(response.data);
      }
    });
  }, []);

  // const addArea = (event) => {
  //   event.preventDefault();

  //   Axios.post("http://localhost:3001/addArea", {
  //     areaType: areaType,
  //     areaTime: areaTime,
  //   }).then((response) => {
  //     if (response.data.message) {
  //       console.log(response.data.message);
  //       setAreaMessage(response.data.message);
  //     }
  //   });
  // };

  const addPayment = (event) => {
    event.preventDefault();

    const cd = new Date(Date.now());
    const depositDate =
      cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();

    Axios.post("http://localhost:3001/addShopPayment", {
      SKID: payingShopkeeper,
      deposit: deposit,
      depositDate: depositDate,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setDepositMessage(response.data.message);
      }
    });
  };

  // const fireReminders = (event) => {
  //   event.preventDefault();

  //   Axios.get("http://localhost:3001/fireReminders").then((response) => {
  //     if (response.data.message) {
  //       console.log(response.data.message);
  //       setDepositMessage(response.data.message);
  //     }
  //   });
  // };

  const extendLicense = (event) => {
    event.preventDefault();

    if (extensionPeriod === 0 || shopkeeperToExtend === "") {
      setExtensionError("Empty field(s) detected.");
    } else {
      Axios.post("http://localhost:3001/extendLicense", {
        SKID: shopkeeperToExtend,
        extensionPeriod: extensionPeriod,
      }).then((response) => {
        if (response.data.message) {
          console.log(response.data.message);
          setExtensionError(response.data.message);
        }
      });
    }
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
          <h1>Add a new shop rent payment</h1>
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Shopkeeper ID</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={payingShopkeeper}
                  required
                  onChange={(e) => setPayingShopkeeper(e.target.value)}
                >
                  <option value="">Select</option>
                  {shopkeepers.map((s, index) => (
                    <option value={s.SKID} key={s.SKID}>
                      {s.SKID}
                    </option>
                  ))}
                </select>

                <label className="label">Deposit amount</label>
                <input
                  type="number"
                  name="deposit"
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => addPayment(e)}>Add payment</button>
            </div>

            <p style={{ color: "#ed5c49" }}>{depositMessage}</p>
          </form>
          {/* <h1>Add new area</h1>
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Area type</label>
                <input
                  type="text"
                  name="areatype"
                  onChange={(e) => setAreaType(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label className="label">Area time</label>
                <input
                  type="number"
                  name="areatime"
                  onChange={(e) => setAreaTime(e.target.value)}
                />
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => addArea(e)}>Add area</button>
            </div>

            <p style={{ color: "#ed5c49" }}>{areaMessage}</p>
          </form> */}
          <h1>Extension requests</h1>
          {extensionRequests.length > 0 ? (
            <form method="POST">
              <div className="inputdetails">
                <div className="input-box">
                  <label className="label">Shopkeeper ID</label>
                  <select
                    style={{ fontSize: "20px" }}
                    value={shopkeeperToExtend}
                    required
                    onChange={(e) => setShopkeeperToExtend(e.target.value)}
                  >
                    <option value="">Select</option>
                    {extensionRequests.map((s, index) => (
                      <option value={s.SKID} key={s.SKID}>
                        {s.SKID}
                      </option>
                    ))}
                  </select>
                  <label className="label">Extension period</label>
                  <input
                    type="number"
                    onChange={(e) => setExtensionPeriod(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="button-holder">
                <button onClick={(e) => extendLicense(e)}>
                  Extend license
                </button>
              </div>

              <p style={{ color: "#ed5c49" }}>{extensionError}</p>
            </form>
          ) : (
            <p>No extension requests.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentsAdmin;
