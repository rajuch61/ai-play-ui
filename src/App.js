import React, { useState } from "react";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./Routes";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // collapsed by default

  return (
    <div className="app-layout">
      <TopNavbar toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} />
      <div className="content-wrapper">
        <Sidebar
          isExpanded={sidebarExpanded}
          className={`sidebar ${sidebarExpanded ? "" : "sidebar-collapsed"}`}
          isLoggedIn={isLoggedIn}
        />
        <main className="app-content">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default App;
