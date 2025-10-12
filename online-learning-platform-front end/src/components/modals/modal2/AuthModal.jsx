import React from "react";
import "./AuthModal.css";

const AuthModal = ({ title, message, type, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-box modal-${type}`}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
