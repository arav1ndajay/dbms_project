import React from "react";
import "../../../App.css";
import "./shopkeeperprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./shopkeepernav/Navbar";
import Sidebar from "./shopkeepersidebar/Sidebar";
import { useSidebar } from "./shopkeepersidebar/SidebarHook";

function Reminders() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [extensionRequested, setExtensionRequested] = useState(false);
  const [hasPaidThisMonth, setHasPaidThisMonth] = useState(false);

  const [expiresIn, setExpiresIn] = useState(-1);

  const [error, setError] = useState("");

  const { isOpen, toggle } = useSidebar();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);
        setLoginStatus(response.data.user[0].Role);

        Axios.post("http://localhost:3001/getLicenseInfo", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.message) setError(response.data.message);
          else {
            setLicenseExpiryDate(
              response.data[0].LicenseExpiryDate.substring(0, 10)
            );
            var expdate = new Date(
              response.data[0].LicenseExpiryDate.substring(0, 10)
            );

            const cd = new Date(Date.now());

            setExpiresIn(
              Math.floor(
                (expdate.getTime() - cd.getTime()) / (1000 * 3600 * 24)
              )
            );
          }
        });

        // check if extension request has been placed
        Axios.post("http://localhost:3001/hasRequestedExtension", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.message) setError(response.data.message);
          else {
            setExtensionRequested(response.data[0].extensionRequested);
          }
        });

        //getting past payments
        Axios.post("http://localhost:3001/getPaymentHistory", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.message) setError(response.data.message);
          else {
            console.log(response.data);
            setPaymentHistory(response.data);
            const cd = new Date(Date.now());

            for (let i = 0; i < response.data.length; i++) {
              var tempDate = response.data[i].depositDate.substring(0, 10);
              
            
              if ((tempDate.substring(0, 4) === cd.getFullYear().toString()) && (parseInt(tempDate.substring(5,7))=== cd.getMonth()+1))
              {
                setHasPaidThisMonth(true);
                break;
              }
            }
              
          }
        });
      } else {
        setLoginStatus("false");
      }
    });
  }, [email]);

  const requestExtension = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/requestExtension", {
      email: email,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
      setExtensionRequested(true);
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "shopkeeper") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          {licenseExpiryDate !== "" && (
            <h2>License expiry date: {licenseExpiryDate}</h2>
          )}
          <h1>Reminders</h1>
          {expiresIn !== -1 && expiresIn < 7 ? (
            <div>
              <div style={{ textAlign: "center" }}>
                License expires in {expiresIn} days
              </div>
              <div className="button-holder">
                {!extensionRequested ? (
                  <button onClick={(e) => requestExtension(e)}>
                    {" "}
                    Request extension period{" "}
                  </button>
                ) : (
                  <p>Extension request has been placed</p>
                )}
              </div>
            </div>
          ) : (
            <div>No reminders!</div>
          )}
          <h1>Rent payment history</h1>
          {paymentHistory.length > 0 && (
            <div>
              <table style={{ border: "1px solid white" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>Payment ID</td>
                    <td style={{ textAlign: "center" }}>Deposit</td>
                    <td style={{ textAlign: "center" }}>Date of Deposit</td>
                  </tr>
                  {paymentHistory.map((p, index) => (
                    <tr key={p.PayID}>
                      <td>{p.PayID}</td>
                      <td>{p.deposit}</td>
                      <td>{p.depositDate.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasPaidThisMonth ? (
                <p>You have paid the rent for this month.</p>
              ) : (
                <p>You haven't paid the rent for this month.</p>
              )}
            </div>
          )}
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default Reminders;
