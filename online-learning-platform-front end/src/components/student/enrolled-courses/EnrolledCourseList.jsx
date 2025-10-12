import React, { useEffect, useState } from "react";
import "./EnrolledCourseList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnrolledCourseList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    navigate("/");
  };

  // Fetch current user details
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/auth/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  // Fetch enrolled courses for the logged-in user
  const fetchEnrolledCourses = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/enrolled-course-list?userId=${userId}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error.message);
    }
  };

  // First, fetch the user
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Once the user is fetched, fetch their courses
  useEffect(() => {
    if (user && user.id) {
      fetchEnrolledCourses(user.id);
    }
  }, [user]);

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="enrolled-courses-page">
      <NavHeader onLogout={handleLogout} />
      <div className="enrolled-courses-container">
        <NavSideBar />
        <div className="enrolled-courses-content">
          <h2 className="enrolled-courses-title">My Enrolled Courses</h2>
          <input
            type="text"
            placeholder="Search enrolled courses..."
            className="enrolled-courses-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="enrolled-courses-list">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div className="enrolled-courses-card" key={index}>
                  <div className="enrolled-courses-info">
                    <h3 className="enrolled-courses-name">{course.title}</h3>
                    <p className="enrolled-courses-description">
                      {course.description}
                    </p>
                  </div>
                  <button
                    className="enrolled-courses-button"
                    onClick={() => navigate(`/enrolled-course/${course.id}`)}
                  >
                    Start Course
                  </button>
                </div>
              ))
            ) : (
              <p className="enrolled-courses-empty">
                {user
                  ? "No enrolled courses found."
                  : "Loading your courses..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseList;
