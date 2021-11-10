import "./App.css";
import Axios from "axios";
import { useState } from "react";

function App() {
  const [empID, setEmpID] = useState("");
  const [empName, setEmpName] = useState("");
  const [email, setEmail] = useState("");

  const submitForm = () => {
    //Axios.post("http://localhost/3001/", );
  };

  return (
    <div class="container">
      <div class="box">
        <div class="header">
          <h2>Register</h2>
        </div>

        <form action="includes/registration.inc.php" method="post">
          <div class="emp-details">
            <div class="input-box">
              <label for="empid" class="label">
                Employee ID
              </label>
              <input type="text" name="empid"></input>
            </div>

            <div class="input-box">
              <label for="email" class="label">
                Email
              </label>
              <input type="text" name="email"></input>
            </div>

            <div class="input-box">
              <label for="empName" class="label">
                Name
              </label>
              <input type="text" name="empName"></input>
            </div>

            <div class="input-box">
              <label for="doj" class="label">
                Date of Joining
              </label>
              <input type="date" name="doj"></input>
            </div>

            <div class="input-box">
              <label for="salary" class="label">
                Salary
              </label>
              <input type="number" name="salary"></input>
            </div>

            <div class="input-box">
              <label for="dept" class="label">
                Department
              </label>
              <input type="text" name="dept"></input>
            </div>

            <div class="input-box">
              <label for="mobno" class="label">
                Mobile no.
              </label>
              <input type="number" name="mobno"></input>
            </div>

            <div class="input-box">
              <label for="passwd" class="label">
                Password
              </label>
              <input type="password" name="passwd_1"></input>
            </div>

            <div class="input-box">
              <label for="passwd" class="label">
                Confirm password
              </label>
              <input type="password" name="passwd_2"></input>
            </div>
          </div>
          <div class="button-holder">
            <p>
              {" "}
              Already a registered employee?{" "}
              <a href="login.php">
                <b>Log in</b>
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
