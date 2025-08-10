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
                <FaUser size={20} />
                {isExpanded && <span style={{ marginLeft: 8 }}>Login</span>}
              </Link>
            </li>
          )}

          {/* Always visible */}
          <li>
            <Link to="/">
              <FaHome size={20} />
              {isExpanded && <span style={{ marginLeft: 8 }}>Home</span>}
            </Link>
          </li>

          {/* Visible only if logged in */}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/playlist">
                  <FaListUl size={20} />
                  {isExpanded && <span style={{ marginLeft: 8 }}>My Playlist</span>}
                </Link>
              </li>
              <li>
                <Link to="/upload">
                  <FaUpload size={20} />
                  {isExpanded && <span style={{ marginLeft: 8 }}>Upload Video</span>}
                </Link>
              </li>
              {/* <li>
                <Link to="/logout">
                  {isExpanded ? "Logout" : <FaSignOutAlt size={20} />}
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
