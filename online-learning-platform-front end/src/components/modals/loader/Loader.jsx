import React from "react";
import "./Loader.css";

const Loader = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="loader-modal-overlay">
      <div className="loader-modal-content">
        {/* Three dots loader */}
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
