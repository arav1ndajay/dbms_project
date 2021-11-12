import React from "react";
import "../../App.css";
import "./adminprofile.css"
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "../admin/adminnav/Navbar";
import Sidebar from "../admin/adminsidebar/Sidebar";
import {useSidebar} from "../admin/adminsidebar/SidebarHook"

function AdminProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");

  const { isOpen, toggle } = useSidebar();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);
        setLoginStatus("true");
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  const logoutUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");
    console.log(loginStatus);
  
    Axios.post("http://localhost:3001/logout", {}).then((response) => {
      console.log("done");
      setLoginStatus("false");
      console.log(loginStatus);
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus === "false") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Welcome, {email}</h1>
          <h3>Navigate to different options from the top.</h3>
          <button onClick={(e) => logoutUser(e)}> Log out </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
