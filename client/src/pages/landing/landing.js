import "../../index.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h2>Welcome!</h2>
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
        </div>
        <Link
          to={"/adminregister"}
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <div className="button-holder">
            <button>Register as Admin</button>
          </div>
        </Link>
        <div className="button-holder">
          <button>Register as Customer</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
