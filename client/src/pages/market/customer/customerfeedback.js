import React from "react";
import "../../../App.css";
import "./customerprofile.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import NavBar from "./customernav/Navbar";
import Sidebar from "./customersidebar/Sidebar";
import { useSidebar } from "./customersidebar/SidebarHook";

function CustomerFeedback() {
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("loading");
  const [shopID, setShopID] = useState("");
  const [error, setError] = useState("");
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [q1rating, setQ1Rating] = useState(1);
  const [q2rating, setQ2Rating] = useState(1);
  const [q3rating, setQ3Rating] = useState(1);
  const [shopIDs, setShopIDs] = useState([]);
  const [comments, setComments] = useState("");

  const ratings = [1, 2, 3, 4, 5];

  const { isOpen, toggle } = useSidebar();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
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

  const submitFeedback = (event) => {
    event.preventDefault();

    if (shopID === "") setError("Please select Shop ID.");
    else {
      Axios.post("http://localhost:3001/submitFeedback", {
        q1rating: q1rating,
        q2rating: q2rating,
        q3rating: q3rating,
        shopID: shopID,
        email: email,
        comments: comments
      }).then((response) => {
        if (response.data.message) setError(response.data.message);
      });
    }
  };

  if (loginStatus === "loading")
    return <h1 style={{ color: "red" }}>Loading profile...</h1>;
  else if (loginStatus !== "customer") return <Navigate to="/" />;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <NavBar toggle={toggle} />
      <div className="container">
        <div className="box">
          <h1>Customer Feedback {shopID}</h1>
          <h2 style={{ margin: 0 }}>Select shop ID</h2>
          <div className="input-box">
            <select
              style={{ fontSize: "20px" }}
              value={shopID}
              required
              onChange={(e) => setShopID(e.target.value)}
            >
              <option value="">Select</option>
              {shopIDs.map((sh, index) => (
                <option value={sh.SHID} key={sh.SHID}>
                  {sh.SHID}
                </option>
              ))}
            </select>{" "}
          </div>
          <h2>Feedback questions</h2>

          {feedbackQuestions.length > 0 && (
            <div>
              <p style={{ margin: 0 }}>Question 1</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q1 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q1}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {ratings.map((r) => (
                  <div
                    key={r}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={q1rating === r ? true : false}
                      onChange={() => setQ1Rating(r)}
                    ></input>
                    <p>{r}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginBottom: 0 }}>Question 2</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q2 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q2}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {ratings.map((r) => (
                  <div
                    key={r}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={q2rating === r ? true : false}
                      onChange={() => setQ2Rating(r)}
                    ></input>
                    <p>{r}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginBottom: 0 }}>Question 3</p>
              <p style={{ margin: 0 }}>
                {feedbackQuestions[0].Q3 === "."
                  ? "Not set."
                  : feedbackQuestions[0].Q3}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {ratings.map((r) => (
                  <div
                    key={r}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={q3rating === r ? true : false}
                      onChange={() => setQ3Rating(r)}
                    ></input>
                    <p>{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form>
            <div className="inputdetails">
              <div className="input-box">
                <label className="label">Comments</label>
                <input
                  type="text"
                  name="comments"
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          </form>
          <div className="button-holder">
            <button onClick={(e) => submitFeedback(e)}>
              {" "}
              Submit feedback{" "}
            </button>
          </div>
          <p style={{ color: "#ed5c49" }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerFeedback;
