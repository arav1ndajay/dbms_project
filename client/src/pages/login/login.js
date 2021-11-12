import "../../App.css";
import Axios from "axios";
import { useState, useEffect } from "react";
import AdminProfile from "../admin/adminprofile";
import { Navigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");

  Axios.defaults.withCredentials = true;

  const loginUser = (event) => {
    event.preventDefault();

    setLoginStatus("loading");

    Axios.post("http://localhost:3001/login", {
      email: email,
      role: "admin",
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginError(response.data.message);
        setLoginStatus("false");
      } else {
        setLoginStatus("true");
      }
      console.log(response.data);
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        console.log(response.data.user);
        setLoginStatus("true");
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  if (loginStatus === "loading")
    return <div style={{ color: "red" }}>Loading...</div>;
  else if (loginStatus === "true") return <Navigate to="/adminprofile" />;

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h2>Login</h2>
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
              </select>
            </div>
            <div className="input-box">
              <label className="label">Email</label>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="button-holder">
            <button onClick={(e) => loginUser(e)}>Login</button>
          </div>
          <div className="button-holder">
            <p>
              Not registered?
              <a href="/register">
                <b> Register </b>
              </a>
            </p>
          </div>
          <p style={{ color: "#ed5c49" }}>{loginError}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
