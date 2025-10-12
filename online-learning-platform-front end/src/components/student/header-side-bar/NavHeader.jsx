import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavHeader.css";

const NavHeader = ({ projectName = "Online Learning Platform", onLogout }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/student-dashboard"); // 🔗 change path if needed
  };

  return (
    <header className="nav-header">
      <div
        className="nav-header-project-name"
        onClick={handleDashboardClick}
        style={{ cursor: "pointer" }}
        title="Go to Dashboard"
      >
        {projectName}
      </div>
      <button className="nav-header-logout" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
};

export default NavHeader;