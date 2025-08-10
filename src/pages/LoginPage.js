import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // Added Link
import "./LoginPage.css";
import config from "../config";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${config.API_USER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        onLoginSuccess(user);
        navigate("/"); // redirect to home after login
      } else {
        const msg = await response.text();
        setError(msg || "Login failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to AIPlay</h2>
      {error && <div className="login-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="login-form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      {/* Register link below form */}
      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
