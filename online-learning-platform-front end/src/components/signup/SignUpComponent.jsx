import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpComponent.css';
import axios from 'axios';
import Modal from '../modals/Modal';
import Loader from '../modals/loader/Loader'

const SignUpComponent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: '' });
  const [loading, setLoading] = useState(false); // Loader state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await axios.post("http://localhost:8080/api/olp/auth/signup", formData);
      
      setModalData({
        title: '🎉 Signup Successful!',
        message: response.data.data || 'Signup successful!',
        type: 'success'
      });
      setShowModal(true);
      setLoading(false); // Hide loader
      navigate("/"); // Redirect after signup

    } catch (error) {
      setModalData({
        title: '⚠️ Signup Failed',
        message: error.response?.data?.data || 'Something went wrong. Please try again later.',
        type: 'error'
      });
      setShowModal(true);
      setLoading(false); // Hide loader
    }
  };

  const goToLogin = () => {
    navigate('/sign-in');
  };

  return (
    <div className="signup-container">
      {/* Loader */}
      <Loader isOpen={loading} />

      {/* Modal */}
      {showModal && (
        <Modal 
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
          onClose={() => setShowModal(false)}
        />
      )}

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Admin">Admin</option>
            <option value="Instructor">Instructor</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div className="login-link-container">
          <p>
            Already signed up?{' '}
            <button onClick={goToLogin} className="login-link-btn">
              Login here
            </button>
          </p>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpComponent;
