// import React from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import ProfileCompleted from "./components/ProfileCompleted";
import Profile from "./components/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profilecompleted" element={<ProfileCompleted />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;