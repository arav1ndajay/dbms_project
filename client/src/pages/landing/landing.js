import "../../index.css";
import { useState, useEffect } from "react";
import { Link, Navigate} from "react-router-dom";
import Axios from "axios";

function Landing() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        console.log(response.data.user);
        setLoginStatus(true);
      }
    });
  }, []);

  if (loginStatus) return <Navigate to="/adminprofile" />;

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
        <div className="button-holder">
          <Link
            to={"/registerhome"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <button> Register </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
