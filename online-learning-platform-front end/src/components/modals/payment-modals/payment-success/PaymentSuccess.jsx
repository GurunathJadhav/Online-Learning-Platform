import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = ({ onClose }) => {
  return (
    <div className="payment-success-overlay">
      <div className="payment-success-box">
        <h2>✅ Payment Successful!</h2>
        <p>Your enrollment has been confirmed. Enjoy your course! 🎉</p>
        <button className="payment-success-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

