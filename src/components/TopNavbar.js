import React from "react";
import { FaPlayCircle, FaSearch, FaMicrophone } from "react-icons/fa";
import "./TopNavbar.css";

const TopNavbar = ({ toggleSidebar }) => {
  return (
    <header className="top-navbar">
      <div className="topnavbar-left">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1 className="app-title">
          <FaPlayCircle className="app-icon" />
          AIPlay
        </h1>
      </div>

      <div className="topnavbar-center">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            aria-label="Search videos"
          />
          <button className="search-btn" aria-label="Search">
            <FaSearch />
          </button>
          <button className="mic-btn" aria-label="Voice Search">
            <FaMicrophone />
          </button>
        </div>
      </div>

      <div className="topnavbar-right">
        <button className="user-icon" aria-label="User Profile">
          👤
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
