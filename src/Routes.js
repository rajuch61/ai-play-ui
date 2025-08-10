import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPlaylist from "./pages/MyPlaylist";
import UploadVideo from "./pages/UploadVideo";
import LoginPage from "./pages/LoginPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/playlist" element={<MyPlaylist />} />
    <Route path="/upload" element={<UploadVideo />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
