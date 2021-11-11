import "./App.css";
import Login from "./pages/login/login";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Landing from "./pages/landing/landing";
import AdminRegister from "./pages/register/adminRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/adminregister" element={<AdminRegister />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
