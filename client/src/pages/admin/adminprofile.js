import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "../admin/adminnav/Navbar";
import Sidebar from "../admin/adminsidebar/Sidebar";
import { useSidebar } from "../admin/adminsidebar/SidebarHook";
import Loader from "react-loader-spinner";

function AdminProfile() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);

  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const { isOpen, toggle } = useSidebar();
  const [verifyError, setVerifyError] = useState("");

  const [usersToVerify, setUsersToVerify] = useState(
    new Array(unverifiedUsers.length).fill(false)
  );

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    console.log("Checking login use effect");
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
    if (loginStatus === "admin") {
      console.log("Getting details use effect");
      setUserDetailsLoading(true);

      Axios.post("http://localhost:3001/getUserDetails", {}).then(
        (response) => {
          setUnverifiedUsers(response.data);
          setUserDetailsLoading(false);
        }
      );
    }
  }, [loginStatus]);

  const logoutUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");

    Axios.post("http://localhost:3001/logout", {}).then((response) => {
      setLoginStatus("false");
    });
  };

  const verifyUsers = (event) => {
    event.preventDefault();

    setUserDetailsLoading(true);

    Axios.post("http://localhost:3001/verifyUsers", {
      usersToVerify: usersToVerify,
    }).then((response) => {
      if (response.data.message) setVerifyError(response.data.message);

      const newUsers = unverifiedUsers.filter(
        (user) => usersToVerify.indexOf(user.UID) === -1
      );

      setUsersToVerify([]);

      setUnverifiedUsers(newUsers);

      setUserDetailsLoading(false);

      console.log(response.data);
    });
  };

  const handleCheck = (UID) => {
    if (usersToVerify.indexOf(UID) === -1)
      setUsersToVerify([...usersToVerify, UID]);
    else {
      setUsersToVerify(usersToVerify.filter((tempid) => tempid !== UID));
    }
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
        <div className="box">
          <h1 style={{ textAlign: "center" }}>Welcome, {email}</h1>
          <h3 style={{ textAlign: "center" }}>Unverfied Users</h3>
          {userDetailsLoading ? (
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
          ) : unverifiedUsers.length > 0 ? (
            <table style={{ border: "1px solid white" }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>UID</td>
                  <td style={{ textAlign: "center" }}>Email</td>
                  <td style={{ textAlign: "center" }}>Role</td>
                  <td style={{ textAlign: "center" }}>Verify</td>
                </tr>
                {unverifiedUsers.map((user, index) => (
                  <tr key={user.UID}>
                    <td>{user.UID}</td>
                    <td>{user.Email}</td>
                    <td style={{ textAlign: "center" }}>{user.Role}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          usersToVerify.indexOf(user.UID) === -1 ? false : true
                        }
                        onChange={() => handleCheck(user.UID)}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No users to verify!</div>
          )}
          {usersToVerify.length > 0 && (
            <div className="button-holder">
              <button onClick={(e) => verifyUsers(e)}> Verify users </button>
            </div>
          )}
          <div className="button-holder">
            <button onClick={(e) => logoutUser(e)}> Log out </button>
          </div>
          <p style={{ color: "#ed5c49" }}>{verifyError}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
