import "./App.css";
import Login from "./pages/login/login";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Landing from "./pages/landing/landing";
import AdminRegister from "./pages/register/adminRegister";
import AdminProfile from "./pages/admin/adminprofile";
import { useState, useEffect } from "react";
import Axios from "axios";
import { Navigate } from "react-router-dom";
import RegisterHome from "./pages/register/registerHome";
import GardenerProfile from "./pages/garden/gardener/gardenerprofile";
import MechanicProfile from "./pages/garden/mechanic/mechanicprofile";
import GuestProfile from "./pages/guesthouse/guest/guestprofile";

function App() {
  Axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/registerhome" element={<RegisterHome />}></Route>
        <Route exact path="/adminregister" element={<AdminRegister />}></Route>
        <Route exact path="/adminprofile" element={<AdminProfile />}></Route>
        <Route
          exact
          path="/gardenerprofile"
          element={<GardenerProfile />}
        ></Route>
        <Route
          exact
          path="/mechanicprofile"
          element={<MechanicProfile />}
        ></Route>
        <Route
          exact
          path="/guestprofile"
          element={<GuestProfile />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
