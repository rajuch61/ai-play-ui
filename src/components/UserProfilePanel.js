import React from "react";
import "./UserProfilePanel.css";

const UserProfilePanel = ({ user, onLogout }) => {
  return (
    <div className="user-profile-panel">
      <div className="user-info">
        <h3>{user.name}</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserProfilePanel;
