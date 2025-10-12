import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInComponent.css';
import Modal from '../modals/Modal';
import Loader from '../modals/loader/Loader'
import axios from 'axios';

const SignInComponent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false); // ✅ Loader state
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    type: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoaderOpen(true); // ✅ Show loader

    try {
      // 1️⃣ Login request
      const response = await axios.post(
        'http://localhost:8080/api/olp/auth/signin',
        formData
      );

      if (response.data.status === 200) {
        const token = response.data.data;
        localStorage.setItem('token', token);

        setModalData({
          title: '✅ Login Successful!',
          message: 'You have logged in successfully.',
          type: 'success',
        });
        setShowModal(true);
        
        // 2️⃣ Fetch role and redirect
        await redirectTo(token);
      }
    } catch (error) {
      setModalData({
        title: '❌ Login Failed',
        message: error.response?.data?.data || 'Invalid username or password.',
        type: 'error',
      });
      setShowModal(true);
    } finally {
      setLoaderOpen(false); // ✅ Hide loader after API completes
    }
  };

  // Redirect based on role
  const redirectTo = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/auth/get-role?token=${token}`
      );

      const role = response.data?.data;

      if (!role) return;

      switch (role) {
        case 'ROLE_ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'ROLE_INSTRUCTOR':
          navigate('/instructor-dashboard');
          break;
        case 'ROLE_STUDENT':
          navigate('/student-dashboard');
          break;
        default:
          console.warn('Unknown role:', role);
          break;
      }
    } catch (error) {
      console.error('Error fetching user role:', error.message);
    }
  };

  return (
    <div className="sign-in-container">
      {/* ✅ Loader Modal */}
      <Loader isOpen={loaderOpen} onClose={() => setLoaderOpen(false)} />

      {/* ✅ Success/Error Modal */}
      {showModal && (
        <Modal
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
          onClose={() => setShowModal(false)}
        />
      )}

      <form className="sign-in-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <div className="sign-in-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sign-in-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="sign-in-btn">
          Sign In
        </button>

        <div className="sign-in-signup-link">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="sign-in-signup-btn"
            onClick={() => navigate('/sign-up')}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInComponent;
