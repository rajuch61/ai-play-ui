import React, { useState, useEffect, useRef } from "react";
import { FaPlayCircle, FaSearch, FaMicrophone } from "react-icons/fa";
import UserProfilePanel from "./UserProfilePanel";
import "./TopNavbar.css";

const TopNavbar = ({ toggleSidebar, currentUser, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="topnavbar-right" ref={profileRef}>
        {currentUser ? (
          <>
            <button
              className="user-icon"
              aria-label="User Profile"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              👤
            </button>
            {showProfile && (
              <UserProfilePanel user={currentUser} onLogout={onLogout} />
            )}
          </>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
