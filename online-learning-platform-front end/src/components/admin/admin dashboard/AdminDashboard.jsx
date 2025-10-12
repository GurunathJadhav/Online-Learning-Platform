import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Admin Info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/olp/auth/get-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin(response.data.data);
      } catch (error) {
        console.error("Error fetching admin:", error.message);
      }
    };
    fetchAdmin();
  }, [token]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/olp/course/admin-dashboard-data",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching admin dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">Loading Admin Dashboard...</div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="admin-dashboard-loading">
        Unable to load admin dashboard data.
      </div>
    );
  }

  // ✅ Destructure backend fields correctly
  const {
    numberOfUsers,
    numberOfInstructor,
    numberOfStudents,
    numberOfCourses,
    numberOfCourseEnrollment,
    topCourses,
    revenuePerCourse,
    currentRegisteredUsers,
  } = dashboardData;

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      {/* Sidebar */}
      <div className="nav-side-bar">
        <NavSideBar />
      </div>

      {/* Main Content */}
      <main className="admin-dashboard-main">
        <h2>
          Welcome,{" "}
          <span style={{ color: "#0052cc" }}>
            {admin ? admin.username : "Admin"}
          </span>
        </h2>

        {/* ===== Stats Cards ===== */}
        <div className="admin-dashboard-stats">
          <div className="admin-dashboard-card stat-blue">
            <div className="admin-dashboard-icon">👥</div>
            <div>Total Users</div>
            <div className="admin-dashboard-value">{numberOfUsers}</div>
          </div>

          <div className="admin-dashboard-card stat-green">
            <div className="admin-dashboard-icon">🎓</div>
            <div>Total Instructors</div>
            <div className="admin-dashboard-value">{numberOfInstructor}</div>
          </div>

          <div className="admin-dashboard-card stat-yellow">
            <div className="admin-dashboard-icon">📘</div>
            <div>Total Courses</div>
            <div className="admin-dashboard-value">{numberOfCourses}</div>
          </div>

          <div className="admin-dashboard-card stat-orange">
            <div className="admin-dashboard-icon">🧑‍🎓</div>
            <div>Total Students</div>
            <div className="admin-dashboard-value">{numberOfStudents}</div>
          </div>

          <div className="admin-dashboard-card stat-purple">
            <div className="admin-dashboard-icon">📈</div>
            <div>Total Enrollments</div>
            <div className="admin-dashboard-value">{numberOfCourseEnrollment}</div>
          </div>
        </div>

        {/* ===== Top Courses & Registered Users ===== */}
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-box">
            <h3>Top Revenue Courses</h3>
            <ul>
              {topCourses && topCourses.length > 0 ? (
                topCourses.map((course, idx) => (
                  <li key={idx}>
                    <strong>{course}</strong> —{" "}
                    <span style={{ color: "#007bff" }}>
                      ₹{revenuePerCourse[idx]}
                    </span>
                  </li>
                ))
              ) : (
                <li>No course data available</li>
              )}
            </ul>
          </div>

          <div className="admin-dashboard-box">
            <h3>Recent Registered Users</h3>
            <ul>
              {currentRegisteredUsers && currentRegisteredUsers.length > 0 ? (
                currentRegisteredUsers.map((user, idx) => (
                  <li key={idx}>{user}</li>
                ))
              ) : (
                <li>No recent users</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
