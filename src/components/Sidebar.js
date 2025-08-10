import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaListUl, FaUpload, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isExpanded, className, isLoggedIn }) => {
  return (
    <aside className={className}>
      <nav>
        <ul>
          
          {!isLoggedIn && (
            <li>
              <Link to="/login">
                {isExpanded ? "Login" : <FaUser size={20} />}
              </Link>
            </li>
          )}

          {/* Always visible */}
          <li>
            <Link to="/">
              {isExpanded ? "Home" : <FaHome size={20} />}
            </Link>
          </li>

          {/* Visible only if logged in */}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/playlist">
                  {isExpanded ? "My Playlist" : <FaListUl size={20} />}
                </Link>
              </li>
              <li>
                <Link to="/upload">
                  {isExpanded ? "Upload Video" : <FaUpload size={20} />}
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  {isExpanded ? "Logout" : <FaSignOutAlt size={20} />}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
