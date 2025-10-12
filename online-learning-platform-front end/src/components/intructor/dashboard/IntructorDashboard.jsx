import React, { useEffect, useState } from "react";
import "./IntructorDashboard.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const [instructor, setInstructor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Instructor Info
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/olp/auth/get-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInstructor(response.data.data);
      } catch (error) {
        console.error("Error fetching instructor:", error.message);
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [token]);

  // Fetch Dashboard Data after instructor is loaded
  useEffect(() => {
    if (!instructor || !instructor.id) return; // ✅ Prevent API call before instructor is available

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/olp/course/instructor-dashboard-data?userId=${instructor.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [instructor, token]); // ✅ depends on instructor (not only token)

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="instructor-dashboard-loading">
        Loading Instructor Dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="instructor-dashboard-loading">
        Unable to load dashboard data.
      </div>
    );
  }

  const {
    totalCourses,
    totalEnrolled,
    totalAssignmentCompleted,
    totalAssignmentPending,
    topCourses,
    enrolledCourses,
    totalEnrolledUsersEachCourse,
    totalGradesEachCourse,
    eachCourseCompletionRate,
  } = dashboardData;

  // Combine performance data
  const performanceData =
    enrolledCourses?.map((course, idx) => ({
      name: course,
      enrolled: totalEnrolledUsersEachCourse[idx] || 0,
      grade: totalGradesEachCourse[idx]
        ? `${totalGradesEachCourse[idx]}%`
        : "—",
      completion: eachCourseCompletionRate[idx] || 0,
      status:
        (eachCourseCompletionRate[idx] || 0) >= 50 ? "Active" : "Ongoing",
    })) || [];

  return (
    <div className="instructor-dashboard-container">
      {/* Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      {/* Sidebar */}
      <div className="nav-side-bar">
        <NavSideBar />
      </div>

      {/* Main Content */}
      <main className="instructor-dashboard-main">
        <h2>
          Welcome,{" "}
          <span style={{ color: "#0052cc" }}>
            {instructor ? instructor.username : "Instructor"}
          </span>
        </h2>

        {/* Stats Cards */}
        <div className="instructor-dashboard-stats">
          <div className="instructor-dashboard-card">
            <div className="stat-icon stat-blue">🎓</div>
            <div>Total Courses Created</div>
            <div className="stat-value">{totalCourses}</div>
          </div>

          <div className="instructor-dashboard-card">
            <div className="stat-icon stat-yellow">👥</div>
            <div>Total Students Enrolled</div>
            <div className="stat-value">{totalEnrolled}</div>
          </div>

          <div className="instructor-dashboard-card">
            <div className="stat-icon stat-green">📘</div>
            <div>Assignments Completed</div>
            <div className="stat-value">{totalAssignmentCompleted}</div>
          </div>

          <div className="instructor-dashboard-card">
            <div className="stat-icon stat-orange">🕒</div>
            <div>Assignments Pending</div>
            <div className="stat-value">{totalAssignmentPending}</div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="instructor-dashboard-content">
          <div className="instructor-dashboard-box">
            <h3>Top Performing Courses</h3>
            <ul>
              {topCourses && topCourses.length > 0 ? (
                topCourses.slice(0, 5).map((course, idx) => (
                  <li key={idx}>
                    <strong>{course}</strong>{" "}
                    <span style={{ color: "#007bff" }}>
                      — {totalEnrolledUsersEachCourse[idx] || 0} Enrolled
                    </span>
                  </li>
                ))
              ) : (
                <li>No courses found</li>
              )}
            </ul>
          </div>

          <div className="instructor-dashboard-box">
            <h3>Overall Teaching Overview</h3>
            <p>
              Total of <strong>{totalEnrolled}</strong> learners across{" "}
              <strong>{totalCourses}</strong> courses.
            </p>
            <p style={{ color: "#0052cc", marginTop: "10px" }}>
              Keep up the great work! 🚀
            </p>
          </div>
        </div>

        {/* Performance Table */}
        <div className="instructor-dashboard-table-section">
          <h3
            style={{
              color: "#0052cc",
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            Course Performance Details
          </h3>

          <div className="instructor-dashboard-table-wrapper">
            <table className="instructor-dashboard-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrolled Students</th>
                  <th>Average Grade</th>
                  <th>Completion</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.length > 0 ? (
                  performanceData.map((course, idx) => (
                    <tr key={idx}>
                      <td>{course.name}</td>
                      <td>{course.enrolled}</td>
                      <td>{course.grade}</td>
                      <td>
                        <div className="instructor-dashboard-progress-mini">
                          <div
                            className="instructor-dashboard-progress-bar-mini"
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span style={{ fontWeight: 500 }}>
                          {course.completion}%
                        </span>
                      </td>
                      <td>{course.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No enrolled courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
