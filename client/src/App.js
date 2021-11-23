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
import BookRoom from "./pages/guesthouse/guest/bookroom";
import GuesthouseAdmin from "./pages/admin/roomadmin";
import RoomAdmin from "./pages/admin/roomadmin";
import StaffAdmin from "./pages/admin/staffadmin";
import GardenAdmin from "./pages/admin/gardenadmin";
import MechanicAdmin from "./pages/admin/mechanicadmin";
import ShopkeeperProfile from "./pages/market/shopkeeper/shopkeeperprofile";
import AreaRequestAdmin from "./pages/admin/arearequestadmin";
import FeedbacksAdmin from "./pages/admin/feedbacksadmin";
import ShopServiceAdmin from "./pages/admin/shopserviceadmin";

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
          path="/gardenerprofile/currentduty"
          element={<MechanicAdmin />}
        ></Route>
        <Route
          exact
          path="/mechanicprofile"
          element={<MechanicProfile />}
        ></Route>
        <Route
          exact
          path="/shopkeeperprofile"
          element={<ShopkeeperProfile />}
        ></Route>
        <Route exact path="/guestprofile" element={<GuestProfile />}></Route>
        <Route
          exact
          path="/guestprofile/bookroom"
          element={<BookRoom />}
        ></Route>
        <Route
          exact
          path="/adminprofile/roomadmin"
          element={<RoomAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/staffadmin"
          element={<StaffAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/gardenadmin"
          element={<GardenAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/mechanicadmin"
          element={<MechanicAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/arearequestadmin"
          element={<AreaRequestAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/shopserviceadmin"
          element={<ShopServiceAdmin />}
        ></Route>
        <Route
          exact
          path="/adminprofile/feedbacksadmin"
          element={<FeedbacksAdmin />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
