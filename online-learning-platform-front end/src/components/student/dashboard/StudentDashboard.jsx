import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import NavHeader from '../header-side-bar/NavHeader';
import NavSideBar from '../header-side-bar/NavSideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../modals/modal2/AuthModal';

// Pie Chart Component
const PieChart = ({ percent, size = 90 }) => {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="#f0f4ff" stroke="#e0e0e0" strokeWidth="10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0052cc" />
          <stop offset="100%" stopColor="#007bff" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="1.2rem" fontWeight="bold" fill="#0052cc">
        {percent}%
      </text>
    </svg>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ visible: false, title: "", message: "" });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthModal({
        visible: true,
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
      });
      return;
    }

    const fetchDashboard = async () => {
      try {
        const userResp = await axios.get('http://localhost:8080/api/olp/auth/get-user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUser = userResp.data.data;
        setUser(fetchedUser);

        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser && storedUser !== fetchedUser.email) {
          // token replaced by another user's login
          setAuthModal({
            visible: true,
            title: "User Changed",
            message: "Another user has logged in on this browser. Please log in again.",
          });
          return;
        }

        // Save user email for next comparison
        localStorage.setItem('loggedUser', fetchedUser.email);

        // Fetch dashboard data
        const dashResp = await axios.get(
          `http://localhost:8080/api/olp/course/dashboard-data?userId=${fetchedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDashboardData(dashResp.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAuthModal({
          visible: true,
          title: "Authentication Error",
          message: "Unable to fetch data. Please log in again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleCloseModal = () => {
    setAuthModal({ visible: false, title: "", message: "" });
    handleLogout();
  };

  if (authModal.visible) {
    return <AuthModal title={authModal.title} message={authModal.message} onClose={handleCloseModal} />;
  }

  if (loading) {
    return <div className="student-dashboard-loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="student-dashboard-error">Failed to load data</div>;
  }

  const topCourses = dashboardData.topCourses || [];
  const enrolledCourses = dashboardData.enrolledCourses || [];
  const completionRate = dashboardData.completionRate || [];
  const grades = dashboardData.grades || [];
  const overallCompletion = dashboardData.courseProgress || 0;

  return (
    <div className="student-dashboard-container">
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>
      <div className="nav-side-bar">
        <NavSideBar />
      </div>

      <main className="student-dashboard-main">
        <h2>
          Welcome,{' '}
          <span style={{ color: '#0052cc' }}>
            {user ? user.username : 'Loading...'}
          </span>
        </h2>

        {/* Stats */}
        <div className="student-dashboard-stats">
          <div className="student-dashboard-card">
            <div className="stat-icon stat-blue">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2C6.48 2 2 6.47 2 12c0 5.53 4.48 10 10 10s10-4.47 10-10c0-5.53-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8z" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            </div>
            <div>Total Courses Enrolled</div>
            <div className="stat-value">{dashboardData.totalCoursesEnrolled}</div>
          </div>

          <div className="student-dashboard-card">
            <div className="stat-icon stat-yellow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2c-2.76 0-5-2.24-5-5 0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.76-2.24 5-5 5z" />
              </svg>
            </div>
            <div>Assessments Pending</div>
            <div className="stat-value">{dashboardData.pendingAssignments}</div>
          </div>

          <div className="student-dashboard-card">
            <div className="stat-icon stat-green">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div>Assessments Completed</div>
            <div className="stat-value">{dashboardData.completedAssignments}</div>
          </div>
        </div>

        {/* Top Courses & Chart */}
        <div className="student-dashboard-content">
          <div className="student-dashboard-box">
            <h3>Top Courses</h3>
            <ul>
              {topCourses.map((course, idx) => (
                <li key={idx}><strong>{course}</strong></li>
              ))}
            </ul>
          </div>

          <div className="student-dashboard-box">
            <h3>Overall Course Completion</h3>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <PieChart percent={overallCompletion} />
              <div style={{ marginTop: 10, color: '#444', fontWeight: 500 }}>
                {overallCompletion}% courses completed
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="student-dashboard-table-section">
          <h3 style={{ color: '#0052cc', marginTop: '2rem', marginBottom: '1rem' }}>
            Course Progress Details
          </h3>

          <div className="student-dashboard-table-wrapper">
            <table className="student-dashboard-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Completion</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((courseTitle, idx) => {
                  const completion = completionRate[idx] || 0;
                  const grade = grades[idx] !== undefined ? grades[idx] : null;
                  const status =
                    completion === 100 ? 'Completed' :
                    completion > 0 ? 'In Progress' : 'Not Started';

                  return (
                    <tr key={idx}>
                      <td>{courseTitle}</td>
                      <td>
                        <div className="student-dashboard-progress-mini">
                          <div
                            className="student-dashboard-progress-bar-mini"
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                        <span style={{ fontWeight: 500 }}>{completion}%</span>
                      </td>
                      <td>{grade !== null ? <span className="grade-value">{grade}</span> : <span className="grade-pending">—</span>}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
