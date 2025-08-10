import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPlaylist from "./pages/MyPlaylist";
import UploadVideo from "./pages/UploadVideo";
import RegisterPage from "./pages/RegisterPage";

const AppRoutes = ({ onLoginSuccess }) => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);


  return (
    <Routes>
      <Route path="/" element={<HomePage user={currentUser}/>} />
      <Route path="/playlist" element={<MyPlaylist user={currentUser}/>} />
      <Route path="/upload" element={<UploadVideo user={currentUser}/>} />
      <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;
