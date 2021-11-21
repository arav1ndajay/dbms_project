import "../../index.css";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Axios from "axios";

function RegisterHome() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffType, setStaffType] = useState("chscook");

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        console.log(response.data.user);
        setLoginStatus(true);
      }
    });
  }, []);

  const registerUser = (event) => {
    event.preventDefault();

    if (role === "admin") {
      Axios.post("http://localhost:3001/registerAdmin", {
        email: email,
        role: "admin",
        password: password,
        confirmPassword: confirmPassword
      }).then((response) => {
        console.log(response);
      });
    }
  };

  if (loginStatus) return <Navigate to="/adminprofile" />;

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h2>Register </h2>
        </div>
        <form method="POST">
          <div className="inputdetails">
            <div className="input-box">
              <label className="label">Role</label>
              <select
                style={{ fontSize: "20px" }}
                value={role}
                required
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="tenant">Tenant</option>
                <option value="gardener">Gardener</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {role === "staff" && (
              <div className="input-box">
                <label className="label">Staff Type</label>
                <select
                  style={{ fontSize: "20px" }}
                  value={staffType}
                  required
                  onChange={(e) => setStaffType(e.target.value)}
                >
                  <option value="chscook">CHS cook</option>
                  <option value="regcook">Regular cook</option>
                  <option value="cookhelper">Cook helper</option>
                  <option value="cleaner">Cleaner</option>
                </select>
              </div>
            )}

            <div className="input-box">
              <label className="label">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {role !== "admin" && (
              <div className="input-box">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="input-box">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter a strong password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-box">
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                placeholder="Same password as above"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="button-holder">
            <button onClick={(e) => registerUser(e)}>Register</button>
          </div>
          <div className="button-holder">
            <p>
              Already registered?
              <a href="/login">
                <b> Login </b>
              </a>
            </p>
          </div>
          <p style={{ color: "#ed5c49" }}></p>
        </form>
      </div>
    </div>
  );
}

/* <div className="button-holder">
          <Link
            to={"/adminregister"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <button> Admin </button>
          </Link>
        </div>
        <div className="button-holder">
          <Link
            to={"/tenantregister"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <button> Tenant </button>
          </Link>
        </div>
        <div className="button-holder">
          <Link
            to={"/customerregister"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <button> Customer </button>
          </Link>
        </div>
        <div className="button-holder">
          <Link
            to={"/login"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <button> Login </button>
          </Link>
        </div> */

export default RegisterHome;
