import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./IntructorCourseDetails.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import Modal from "../../modals/Modal";

const IntructorCourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/get-course?courseId=${courseId}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );
      setCourse(response.data.data);
    } catch (error) {
      console.error("Error fetching course details:", error.message);
      setModal({
        show: true,
        title: "Error",
        message: "Failed to load course details. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      );
      if (!confirmDelete) return;

      const response = await axios.delete(
        `http://localhost:8080/api/olp/course/delete-course?courseId=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = response?.data?.message || "Course deleted successfully!";
      setModal({
        show: true,
        title: "Success",
        message,
        type: "success",
      });

      // Redirect after short delay
      setTimeout(() => navigate("/instructor/dashboard"), 2000);
    } catch (error) {
      console.error("Error deleting course:", error.message);
      setModal({
        show: true,
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to delete course. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="instructor-course-details-loading">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="instructor-course-details-error">
        Course not found.
      </div>
    );
  }

  return (
    <div className="instructor-course-details-container">
      {/* Header */}
      <div className="instructor-course-details-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="instructor-course-details-main">
        {/* Sidebar */}
        <div className="instructor-course-details-nav-side-bar">
          <NavSideBar />
        </div>

        {/* Main Content */}
        <div className="instructor-course-details-content-wrapper">
          <div className="instructor-course-details-content">
            <h2 className="instructor-course-details-page-title">
              🎓 Instructor Course Details
            </h2>

            <div className="instructor-course-details-card">
              <h1 className="instructor-course-details-name">{course.title}</h1>
              <p className="instructor-course-details-description">
                {course.description}
              </p>

              <div className="instructor-course-details-divider" />

              <h3 className="instructor-course-details-section-title">
                📚 Course Modules
              </h3>
              <div className="instructor-course-details-modules-grid">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module) => (
                    <div
                      key={module.id}
                      className="instructor-course-details-module-card"
                    >
                      <div className="instructor-course-details-module-icon">
                        📖
                      </div>
                      <div className="instructor-course-details-module-content">
                        <h4 className="instructor-course-details-module-title">
                          {module.title}
                        </h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="instructor-course-details-no-modules">
                    No modules available.
                  </p>
                )}
              </div>

              {/* Footer with Delete Button */}
              <div className="instructor-course-details-footer">
                <button
                  className="instructor-course-details-delete-btn"
                  onClick={deleteCourse}
                >
                  🗑️ Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <Modal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
};

export default IntructorCourseDetails;
