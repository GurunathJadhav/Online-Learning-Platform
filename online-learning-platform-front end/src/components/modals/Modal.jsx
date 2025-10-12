import React from 'react';
import './Modal.css';

const Modal = ({ title, message, type, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-box ${type}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
