import React from "react";
import "../../App.css";
import "./adminprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./adminnav/Navbar";
import Sidebar from "./adminsidebar/Sidebar";
import { useSidebar } from "./adminsidebar/SidebarHook";

function FeedbacksAdmin() {
  const [loginStatus, setLoginStatus] = useState("loading");
  const [error, setError] = useState("");
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [SHID, setSHID] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [shopIDs, setShopIDs] = useState([]);
  const [rating, setRating] = useState(0);

  const { isOpen, toggle } = useSidebar();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user[0].Role);
      } else {
        setLoginStatus("false");
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getFeedbackQuestions").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        console.log(response.data);
        setFeedbackQuestions(response.data);
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/getShopIDs").then((response) => {
      if (response.data.message) {
        setError(response.data.message);
      } else {
        console.log(response.data);
        setShopIDs(response.data);
      }
    });
  }, []);

  // const addArea = (event) => {
  //   event.preventDefault();

  //   Axios.post("http://localhost:3001/addArea", {
  //     areaType: areaType,
  //     areaTime: areaTime,
  //   }).then((response) => {
  //     if (response.data.message) {
  //       console.log(response.data.message);
  //       setAreaMessage(response.data.message);
  //     }
  //   });
  // };

  // const createRequest = (event) => {
  //   event.preventDefault();

  //   Axios.post("http://localhost:3001/createRequest", {
  //     areaID: areaToRequest,
  //   }).then((response) => {
  //     if (response.data.message) {
  //       console.log(response.data.message);
  //       setReqMessage(response.data.message);
  //     }
  //   });
  // };

  const updateFeedbackQuestions = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/updateFeedbackQuestions", {
      q1: q1,
      q2: q2,
      q3: q3,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setError(response.data.message);
      }
    });
  };

  const getShopRating = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/getShopRating", {
      SHID: SHID,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setError(response.data.message);
      } else {
        console.log(response.data);
        setRating(response.data[0].rating);
      }
    });
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "admin") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Feedback questions</h1>

          {feedbackQuestions.length > 0 && (
            <div>
              <p style={{ margin: 0 }}>Question 1</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q1 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q1}
              </p>
              <p style={{ marginBottom: 0 }}>Question 2</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q2 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q2}
              </p>
              <p style={{ marginBottom: 0 }}>Question 3</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q3 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q3}
              </p>
            </div>
          )}

          <div className="button-holder">
            <button onClick={(e) => setShowEditDialog(!showEditDialog)}>
              {showEditDialog ? "Cancel edit" : "Edit questions"}
            </button>
          </div>

          {showEditDialog && (
            <div>
              <h1 style={{ margin: 0 }}>Edit feedback questions</h1>
              <h3 style={{ marginTop: 0 }}>(Leave it blank to not update)</h3>
              <form method="POST">
                <div className="inputdetails">
                  <div className="input-box">
                    <label className="label">Question 1</label>
                    <input
                      type="text"
                      name="areatype"
                      onChange={(e) => setQ1(e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label className="label">Question 2</label>
                    <input
                      type="text"
                      name="areatype"
                      onChange={(e) => setQ2(e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label className="label">Question 3</label>
                    <input
                      type="text"
                      name="areatype"
                      onChange={(e) => setQ3(e.target.value)}
                    />
                  </div>
                </div>
                <div className="button-holder">
                  <button onClick={(e) => updateFeedbackQuestions(e)}>
                    Update question(s)
                  </button>
                </div>

                <p style={{ color: "#ed5c49" }}>{error}</p>
              </form>
            </div>
          )}
          {!showEditDialog && (
            <div>
              <h1 style={{ margin: 0 }}>View shop rating</h1>
              <form method="POST">
                <div className="inputdetails">
                  <p style={{ scrollSnapMarginTop: 0 }}>Select Shop ID</p>
                  <div className="input-box">
                    <select
                      style={{ fontSize: "20px" }}
                      value={SHID}
                      required
                      onChange={(e) => setSHID(e.target.value)}
                    >
                      <option value="">Select</option>
                      {shopIDs.map((sh, index) => (
                        <option value={sh.SHID} key={sh.SHID}>
                          {sh.SHID}
                        </option>
                      ))}
                    </select>
                    <div className="button-holder">
                      <button onClick={(e) => getShopRating(e)}>
                        Get rating
                      </button>
                    </div>
                    {rating !== 0 && (rating === -1 ? (
                      <p>No ratings yet.</p>
                    ) : (
                      <p style={{ margin: 0 }}>Rating: {rating}</p>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbacksAdmin;
