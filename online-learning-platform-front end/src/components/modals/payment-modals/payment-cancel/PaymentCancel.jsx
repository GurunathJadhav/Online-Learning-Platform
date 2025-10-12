import React from 'react';
import './PaymentCancel.css';

const PaymentCancel = ({ onClose }) => {
  return (
    <div className="payment-cancel-overlay">
      <div className="payment-cancel-box">
        <h2>⚠️ Payment Cancelled</h2>
        <p>Your payment was cancelled. You can try again anytime.</p>
        <button className="payment-cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;

