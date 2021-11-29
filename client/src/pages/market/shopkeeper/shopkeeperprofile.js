import React from "react";
import "../../../App.css";
import "./shopkeeperprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./shopkeepernav/Navbar";
import Sidebar from "./shopkeepersidebar/Sidebar";
import { useSidebar } from "./shopkeepersidebar/SidebarHook";
import Loader from "react-loader-spinner";
function ShopkeeperProfile() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopID, setShopID] = useState("");
  const [error, setError] = useState("");
  const [showDeleteItemBox, setShowDeleteItemBox] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [rating, setRating] = useState("");
  const [totalSales, setTotalSales] = useState("");
  const [price, setPrice] = useState(0);
  const [itemName, setItemName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [itemsInShop, setItemsInShop] = useState([]);

  const { isOpen, toggle } = useSidebar();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        Axios.post("http://localhost:3001/getShopID", {
          email: response.data.user[0].Email,
        }).then((response) => {
          if (response.data.message) setError(response.data.message);
          else setShopID(response.data[0].SHID);

          Axios.post("http://localhost:3001/getItemsInShop", {
            SHID: response.data[0].SHID,
          }).then((response) => {
            if (response.data.message) setError(response.data.message);
            else setItemsInShop(response.data);
            console.log(response.data);
          });

          Axios.post("http://localhost:3001/getShopRating", {
            SHID: response.data[0].SHID,
          }).then((response) => {
            if (response.data.message) {
              console.log(response.data.message);
              setError(response.data.message);
            } else {
              console.log(response.data);
              setRating(response.data[0].rating);
            }
          });
          Axios.post("http://localhost:3001/getTotalSales", {
            SHID: response.data[0].SHID,
          }).then((response) => {
            if (response.data.message) {
              console.log(response.data.message);
              setError(response.data.message);
            } else {
              console.log(response.data);
              setTotalSales(response.data[0].totalSales);
            }
          });
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

  const addItemToShop = (event) => {
    Axios.post("http://localhost:3001/addItemToShop", {
      shopID: shopID,
      itemName: itemName,
      price: price,
      expiryDate: expiryDate,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
    });
  };

  const deleteItemFromShop = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/deleteItemFromShop", {
      itemID: itemToDelete,
      shopID: shopID,
    }).then((response) => {
      if (response.data.message) setError(response.data.message);
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
  else if (loginStatus !== "shopkeeper") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1 style={{ marginBottom: 0 }}>Welcome, shopkeeper of {shopID}</h1>
          <h4 style={{ marginTop: "5px", marginBottom: 0 }}>
            Shop rating: {rating}/5{" "}
          </h4>
          <h4 style={{ margin: 0 }}>Total sales: INR {totalSales} </h4>
          <h1>Items in shop {shopID}</h1>
          {itemsInShop.length > 0 && (
            <table style={{ border: "1px solid white" }}>
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
          )}
          {showDeleteItemBox ? (
            <div>
              <div className="button-holder">
                <button
                  onClick={(e) => setShowDeleteItemBox(!showDeleteItemBox)}
                >
                  {showDeleteItemBox ? "Delete item form" : "Add item form"}
                </button>
              </div>
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Item ID (to delete)</label>
                    <input
                      type="text"
                      onChange={(e) => setItemToDelete(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="button-holder">
                  <button onClick={(e) => deleteItemFromShop(e)}>
                    {" "}
                    Delete item{" "}
                  </button>
                </div>
                <p style={{ color: "#ed5c49" }}>{error}</p>
              </form>
            </div>
          ) : (
            <div>
              <div className="button-holder">
                <button
                  onClick={(e) => setShowDeleteItemBox(!showDeleteItemBox)}
                >
                  {showDeleteItemBox ? "Delete item form" : "Add item form"}
                </button>
              </div>
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Item Name</label>
                    <input
                      type="text"
                      onChange={(e) => setItemName(e.target.value)}
                    ></input>
                  </div>
                  <div className="input-box">
                    <label className="label">Price (per unit)</label>
                    <input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                    ></input>
                  </div>
                  <div className="input-box">
                    <label className="label">Expiry Date</label>
                    <input
                      type="date"
                      onChange={(e) => setExpiryDate(e.target.value)}
                    ></input>
                  </div>
                </div>
                <p style={{ color: "#ed5c49" }}>{error}</p>
              </form>
              <div className="button-holder">
                <button onClick={(e) => addItemToShop(e)}> Add item </button>
              </div>
            </div>
          )}

          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopkeeperProfile;
