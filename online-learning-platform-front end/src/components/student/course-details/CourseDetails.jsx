import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import Modal from "../../modals/Modal";

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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

  // Fetch current user
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
      setModal({
        show: true,
        title: "Error",
        message: "Failed to fetch user information. Please log in again.",
        type: "error",
      });
    }
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

  // Run on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchCourseDetails();
  }, [courseId]);

  // Enrollment logic with modal (handles both HTTP errors and "error-in-success-response" payloads)
  const enroll = async (courseId) => {
    try {
      if (!user) {
        setModal({
          show: true,
          title: "Login Required",
          message: "Please log in to enroll in this course.",
          type: "warning",
        });
        return;
      }

      // POST enrollment (include auth header in case backend requires it)
      const response = await axios.post(
        `http://localhost:8080/api/olp/enrollment/enroll?courseId=${courseId}&userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const respData = response?.data;

      // Case 1: backend returns status field indicating failure inside a 200 response
      if (respData && typeof respData === "object" && respData.status) {
        const statusNum = Number(respData.status);
        if (!Number.isNaN(statusNum) && statusNum !== 200) {
          const backendMessage = respData.data || respData.message || "Enrollment failed.";
          const isAlready = String(backendMessage).toLowerCase().includes("already exists");
          setModal({
            show: true,
            title: isAlready ? "Already Enrolled" : "Enrollment Failed",
            message: backendMessage,
            type: isAlready ? "warning" : "error",
          });
          return;
        }
      }

      // Case 2: respData.data might be a URL string (success), or a plain message string (error)
      const returnedData = respData?.data;

      // If returnedData is a string:
      if (typeof returnedData === "string") {
        if (returnedData.startsWith("http")) {
          // valid payment url -> redirect
          window.location.href = returnedData;
          return;
        } else {
          // server returned message string (e.g. "Enrollment with user already exists")
          const isAlready = returnedData.toLowerCase().includes("already exists");
          setModal({
            show: true,
            title: isAlready ? "Already Enrolled" : "Enrollment Failed",
            message: returnedData,
            type: isAlready ? "warning" : "error",
          });
          return;
        }
      }

      // Case 3: respData.data could be an object containing a url/paymentUrl field
      const paymentUrl =
        (returnedData && (returnedData.paymentUrl || returnedData.url)) ||
        respData?.paymentUrl ||
        respData?.url;

      if (typeof paymentUrl === "string" && paymentUrl.startsWith("http")) {
        window.location.href = paymentUrl;
        return;
      }

      // Fallback: we couldn't find a valid payment URL or an explicit backend message
      setModal({
        show: true,
        title: "Payment Error",
        message: "Invalid payment link received. Please contact support.",
        type: "error",
      });
    } catch (error) {
      console.error("Enrollment failed:", error);

      // Try to extract backend message from error response
      const backendMessage =
        error.response?.data?.data || error.response?.data?.message || error.message;

      if (typeof backendMessage === "string" && backendMessage.toLowerCase().includes("already exists")) {
        setModal({
          show: true,
          title: "Already Enrolled",
          message: backendMessage,
          type: "warning",
        });
      } else {
        setModal({
          show: true,
          title: "Enrollment Failed",
          message: backendMessage || "Something went wrong during enrollment. Please try again.",
          type: "error",
        });
      }
    }
  };

  if (loading) {
    return <div className="course-details-loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="course-details-error">Course not found.</div>;
  }

  return (
    <div className="course-details-container">
      {/* Fixed Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="course-details-main">
        {/* Sidebar */}
        <div className="course-details-nav-side-bar">
          <NavSideBar />
        </div>

        {/* Main Content */}
        <div className="course-details-content-wrapper">
          <div className="course-details-content">
            <h2 className="course-details-page-title">📘 Course Details</h2>

            <div className="course-details-card">
              <h1 className="course-details-name">{course.title}</h1>
              <p className="course-details-description">{course.description}</p>

              <div className="course-details-divider" />

              <h3 className="course-details-section-title">📚 Course Modules</h3>
              <div className="course-details-modules-grid">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module) => (
                    <div key={module.id} className="course-details-module-card">
                      <div className="module-icon">📖</div>
                      <div className="module-content">
                        <h4 className="module-title">{module.title}</h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-modules">No modules available.</p>
                )}
              </div>

              <div className="course-details-footer">
                <p className="course-details-price">
                  Price: ₹{Number(course.price).toLocaleString("en-IN")}
                </p>

                <button className="course-details-enroll-btn" onClick={() => enroll(course.id)}>
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <Modal title={modal.title} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />
      )}
    </div>
  );
};

export default CourseDetails;
