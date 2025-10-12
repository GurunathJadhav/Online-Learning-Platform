import React from 'react';
import './PaymentFailed.css';

const PaymentFailed = ({ onClose }) => {
  return (
    <div className="payment-failed-overlay">
      <div className="payment-failed-box">
        <h2>❌ Payment Failed</h2>
        <p>Something went wrong while processing your payment. Please try again.</p>
        <button className="payment-failed-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;

