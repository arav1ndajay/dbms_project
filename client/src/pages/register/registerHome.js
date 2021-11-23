import "../../index.css";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Axios from "axios";

function RegisterHome() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [contactnum, setContactnum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffType, setStaffType] = useState("chscook");

  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  const registerUser = (event) => {
    event.preventDefault();

    // first register user into users table
    Axios.post("http://localhost:3001/registerUser", {
      email: email,
      role: role,
      password: password,
      confirmPassword: confirmPassword,
    }).then((response) => {
      if (response.data.message) {
        setRegisterMessage(response.data.message);
      }
      console.log(response);
    });

    // next add users to respective tables based on role
    if (role === "admin") {
      Axios.post("http://localhost:3001/registerAdmin", {
        aname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response);
      });
    } else if (role === "guest") {
      Axios.post("http://localhost:3001/registerGuest", {
        gname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response);
      });
    } else if (role === "gardener") {
      Axios.post("http://localhost:3001/registerGardener", {
        gdname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response.data);
      });
    } else if (role === "mechanic") {
      Axios.post("http://localhost:3001/registerMechanic", {
        mname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response.data);
      });
    } else if (role === "staff") {
      Axios.post("http://localhost:3001/registerStaff", {
        stname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
        stype: staffType,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response.data);
      });
    } else if (role === "customer") {
      Axios.post("http://localhost:3001/registerCustomer", {
        cname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response.data);
      });
    } else if (role === "shopkeeper") {
      Axios.post("http://localhost:3001/registerShopkeeper", {
        skname: name,
        contactnum: contactnum,
        dob: dob,
        email: email,
      }).then((response) => {
        if (response.data.message) {
          setRegisterMessage(response.data.message);
        }
        console.log(response.data);
      });
    }
  };

  if (loginStatus === "loading")
    return <div style={{ color: "red" }}>Loading...</div>;
  if (loginStatus === "admin") return <Navigate to="/adminprofile" />;
  else if (loginStatus === "gardener")
    return <Navigate to="/gardenerprofile" />;
  else if (loginStatus === "mechanic")
    return <Navigate to="/mechanicprofile" />;
  else if (loginStatus === "guest") return <Navigate to="/guestprofile" />;
  else if (loginStatus === "shopkeeper") return <Navigate to="/shopkeeperprofile" />;

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
                <option value="guest">Guest</option>
                <option value="gardener">Gardener</option>
                <option value="admin">Admin</option>
                <option value="mechanic">Mechanic</option>
                <option value="staff">Staff</option>
                <option value="shopkeeper">Shopkeeper</option>
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

            <div className="input-box">
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label className="label">Date Of Birth</label>
              <input
                type="date"
                name="doj"
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label className="label">Contact number</label>
              <input
                type="text"
                name="contactnum"
                maxLength="10"
                placeholder="Enter your phone number without country code"
                onChange={(e) => setContactnum(e.target.value)}
              />
            </div>

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
            <button
              onClick={(e) => registerUser(e)}
              disabled={registerMessage !== ""}
            >
              Register
            </button>
          </div>
          <div className="button-holder">
            <p>
              Already registered?
              <a href="/login">
                <b> Login </b>
              </a>
            </p>
          </div>
          <p style={{ color: "#ed5c49" }}>{registerMessage}</p>
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
