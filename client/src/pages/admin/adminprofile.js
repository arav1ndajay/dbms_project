import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "../admin/adminnav/Navbar";
import Sidebar from "../admin/adminsidebar/Sidebar";
import { useSidebar } from "../admin/adminsidebar/SidebarHook";

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
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setEmail(response.data.user[0].Email);
        setLoginStatus("true");
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  useEffect(() => {
    setUserDetailsLoading(true);
    console.log("Called use effect");

    Axios.post("http://localhost:3001/getUserDetails", {}).then((response) => {
      setUnverifiedUsers(response.data);
      setUserDetailsLoading(false);
    });
  }, []);

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
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus === "false") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="adminContainer">
        <div className="adminBox">
          <h1>Welcome, {email}</h1>
          <h3>Unverfied Users</h3>
          {userDetailsLoading ? (
            <div>Loading...</div>
          ) : unverifiedUsers.length > 0 ? (
            <table>
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
            <button onClick={(e) => verifyUsers(e)}> Verify users </button>
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
