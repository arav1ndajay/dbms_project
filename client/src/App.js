import "./App.css";
import Login from "./pages/login/login";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Landing from "./pages/landing/landing";
import AdminRegister from "./pages/register/adminRegister";
import AdminProfile from "./pages/admin/adminprofile";
import { useState, useEffect } from "react";
import Axios from "axios";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";
import RegisterHome from "./pages/register/registerHome";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
