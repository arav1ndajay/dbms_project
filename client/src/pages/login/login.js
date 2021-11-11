import "../../App.css";
import Axios from "axios";
import { useState } from "react";

function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const loginUser = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/login", {
      email: email,
      role: "admin",
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].Email);
      }
      console.log(response.data);
    });
  };

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h2>Login</h2>
        </div>
        <form method="post">
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
              <a href="login.php">
                <b> Register </b>
              </a>
            </p>
          </div>
          <p>{loginStatus}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
