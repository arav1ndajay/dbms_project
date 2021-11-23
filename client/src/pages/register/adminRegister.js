import "../../App.css";
import Axios from "axios";
import { useState } from "react";

function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerAdmin = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/registerAdmin", {
      email: email,
      role: "admin",
      password: password,
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h2>Admin Registration</h2>
        </div>
        <form method="post">
          <div className="inputdetails">
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

            <div className="input-box">
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="button-holder">
            <button onClick={(e) => registerAdmin(e)}>Register</button>
          </div>
          <div className="button-holder">
            <p>
              Already registered?
              <a href="login.php">
                <b> Log in</b>
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
