import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import UserProfilePanel from "./components/UserProfilePanel";
import "./App.css";

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setShowProfilePanel(false);
    navigate("/");
  };

  const isLoggedIn = currentUser !== null;

  return (
    <AuthProvider>
      <div className="app-layout">
        <TopNavbar
          toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onProfileClick={() => setShowProfilePanel(true)}
        />
        <div className="content-wrapper">
          <Sidebar
            isExpanded={sidebarExpanded}
            className={`sidebar ${sidebarExpanded ? "" : "sidebar-collapsed"}`}
            isLoggedIn={isLoggedIn}
          />
          <main className="app-content">
            <AppRoutes onLoginSuccess={handleLoginSuccess} />
          </main>
        </div>
        {showProfilePanel && (
          <UserProfilePanel
            user={currentUser}
            onClose={() => setShowProfilePanel(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
