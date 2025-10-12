import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import "./EnrolledCourse.css";

const EnrolledCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/auth/get-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  const fetchCourseDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/enrolled-course?courseId=${courseId}&userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const courseData = response.data.data;
      setCourse(courseData.course || courseData);
      setModules(courseData.modules || []);
    } catch (error) {
      console.error("Error fetching course details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchCourseDetails(user.id);
    }
  }, [user, courseId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/lessons/${courseId}/${moduleId}`);
  };

  return (
    <div className="enrolled-course-page">
      <NavHeader onLogout={handleLogout} />
      <div className="enrolled-course-body">
        <NavSideBar />
        <div className="enrolled-course-main-content">
          {loading ? (
            <p className="enrolled-course-loading">Loading course details...</p>
          ) : course ? (
            <>
              <h2 className="enrolled-course-title">{course.title}</h2>
              <p className="enrolled-course-description">
                {course.description}
              </p>

              <div className="enrolled-course-module-list">
                {modules.length > 0 ? (
                  modules.map((module, index) => (
                    <div
                      className="enrolled-course-module-card"
                      key={index}
                      onClick={() => handleModuleClick(module.id)}
                    >
                      <div className="enrolled-course-module-info">
                        <h3 className="enrolled-course-module-name">
                          {module.title}
                        </h3>
                      </div>
                      <button
                        className="enrolled-course-view-btn"
                        onClick={() =>
                          navigate(`/lessons/${course.id}/${module.id}`)
                        }
                      >
                        View Lessons
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="enrolled-course-empty">
                    No modules found for this course.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="enrolled-course-empty">
              Course not found or unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourse;