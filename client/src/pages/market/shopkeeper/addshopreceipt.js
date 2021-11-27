import React from "react";
import "../../../App.css";
import "./shopkeeperprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./shopkeepernav/Navbar";
import Sidebar from "./shopkeepersidebar/Sidebar";
import { useSidebar } from "./shopkeepersidebar/SidebarHook";

function AddShopReceipt() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopID, setShopID] = useState("");
  const [error, setError] = useState("");

  const [customerID, setCustomerID] = useState("");
  const [itemID, setItemID] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState(0);

  const { isOpen, toggle } = useSidebar();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);

        Axios.post("http://localhost:3001/getShopID", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.message) setError(response.data.message);
          else setShopID(response.data[0].SHID);

          // Axios.post("http://localhost:3001/getItemsInShop", {
          //   SHID: response.data[0].SHID,
          // }).then((response) => {
          //   if (response.data.message) setError(response.data.message);
          //   else setItemsInShop(response.data);
          //   console.log(response.data);
          // });
        });

        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
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

  const addReceipt = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/addReceipt", {
      itemID: itemID,
      shopID: shopID,
      customerID: customerID,
      quantity: quantity,
      purchaseDate: purchaseDate,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
    });
  };

  // const deleteItemFromShop = (event) => {
  //   event.preventDefault();

  //   Axios.post("http://localhost:3001/deleteItemFromShop", {
  //     itemID: itemToDelete,
  //     shopID: shopID,
  //   }).then((response) => {
  //     if (response.data.message) setError(response.data.message);
  //   });
  // };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "shopkeeper") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Add new shop receipt</h1>
          <form method="POST">
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Customer ID</label>
                <input
                  type="text"
                  onChange={(e) => setCustomerID(e.target.value)}
                ></input>
              </div>
              <div className="input-box">
                <label className="label">Purchase Date</label>
                <input
                  type="date"
                  onChange={(e) => setPurchaseDate(e.target.value)}
                ></input>
              </div>
              <div className="input-box">
                <label className="label">Item ID</label>
                <input
                  type="text"
                  onChange={(e) => setItemID(e.target.value)}
                ></input>
              </div>
              <div className="input-box">
                <label className="label">Quantity</label>
                <input
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="button-holder">
              <button onClick={(e) => addReceipt(e)}> Add receipt </button>
            </div>
            <p style={{ color: "#ed5c49" }}>{error}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddShopReceipt;
