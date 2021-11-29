import React from "react";
import "../../../App.css";
import "./customerprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./customernav/Navbar";
import Sidebar from "./customersidebar/Sidebar";
import { useSidebar } from "./customersidebar/SidebarHook";
import Loader from "react-loader-spinner";
function CustomerProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopID, setShopID] = useState("");
  const [error, setError] = useState("");
  const [shopIDs, setShopIDs] = useState([]);
  const [itemsInShop, setItemsInShop] = useState([]);
  const [pastPurchases, setPastPurchases] = useState([]);

  const { isOpen, toggle } = useSidebar();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);
        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getShopIDsWithItems").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        console.log(response.data);
        setShopIDs(response.data);
      }
    });
  }, []);

  const logoutUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");

    Axios.post("http://localhost:3001/logout", {}).then((response) => {
      setLoginStatus("false");
    });
  };

  const getItemsAndOrders = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/getItemsInShop", {
      SHID: shopID,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
      else setItemsInShop(response.data);
      console.log(response.data);
    });

    Axios.post("http://localhost:3001/getPastPurchases", {
      SHID: shopID,
      email: email,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
      else setPastPurchases(response.data);
      console.log(response.data);
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
  else if (loginStatus !== "customer") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Shop details</h1>
          <h2 style={{ margin: 0 }}>Select shop ID</h2>
          <div className="input-box">
            <select
              style={{ fontSize: "20px" }}
              value={shopID}
              required
              onChange={(e) => setShopID(e.target.value)}
            >
              <option value="">Select</option>
              {shopIDs.map((sh, index) => (
                <option value={sh.SHID} key={sh.SHID}>
                  {sh.SHID}
                </option>
              ))}
            </select>{" "}
          </div>
          {itemsInShop.length > 0 && (
            <div>
              <p stlye={{ margin: 0 }}>Items in shop</p>
              <table style={{ border: "1px solid white", marginTop: "0px" }}>
                <tbody>
                  <tr>
                    <td>ItemID</td>
                    <td>ItemName</td>
                    <td>Price</td>
                    <td>Expiry Date</td>
                  </tr>
                  {itemsInShop.map((i, index) => (
                    <tr key={i.ItemID}>
                      <td>{i.ItemID}</td>
                      <td>{i.ItemName}</td>
                      <td>{i.Price}</td>
                      <td>{i.ExpiryDate.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pastPurchases.length > 0 ? (
            <div>
              <p stlye={{ margin: 0 }}>Past purchases</p>
              <table style={{ border: "1px solid white", margin: 0 }}>
                <tbody>
                  <tr>
                    <td>SRID</td>
                    <td>ItemID</td>
                    <td>Purchase date</td>
                    <td>Quantity</td>
                    <td>Total price</td>
                  </tr>
                  {pastPurchases.map((p, index) => (
                    <tr key={p.SRID}>
                      <td>{p.SRID}</td>
                      <td>{p.ItemID}</td>
                      <td>{p.PurchaseDate.substring(0, 10)}</td>
                      <td>{p.Quantity}</td>
                      <td>{p.Cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            itemsInShop.length > 0 && <p>No past purchases.</p>
          )}

          <div className="button-holder">
            <button onClick={(e) => getItemsAndOrders(e)}>
              {" "}
              Show items and past orders{" "}
            </button>
          </div>
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
