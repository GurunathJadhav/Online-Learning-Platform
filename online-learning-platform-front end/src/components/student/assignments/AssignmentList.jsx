import React, { useEffect, useState } from "react";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import "./AssignmentList.css";
import axios from "axios";
import Modal from "../../modals/Modal";

const AssignmentList = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const showModal = (title, message, type) => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ show: false, title: "", message: "", type: "" });
  };

  // Fetch current logged-in user
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/auth/get-user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/enrolled-course-list?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      return [];
    }
  };

  // Fetch assignments for courses
  const fetchAssignmentsForCourses = async (courses) => {
    try {
      const allAssignments = [];
      await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/olp/assignment/assignment-list?pageNumber=0&pageSize=10&courseId=${course.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const courseAssignments = response.data.data || [];
            const labeledAssignments = courseAssignments.map((a) => ({
              ...a,
              courseTitle: course.title || "Unknown Course",
            }));

            allAssignments.push(...labeledAssignments);
          } catch (err) {
            console.error(`Error fetching assignments for ${course.title}:`, err);
          }
        })
      );

      setAssignments(allAssignments);
      fetchSubmissionsForAssignments(allAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions for each assignment
  const fetchSubmissionsForAssignments = async (assignmentsList) => {
    if (!user || !user.id) return;

    try {
      const updatedAssignments = await Promise.all(
        assignmentsList.map(async (assignment) => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/olp/submission/submission-list?assignmentId=${assignment.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const submissions = response.data.data || [];
            const userSubmission = submissions.find((s) => s.userId === user.id);

            return {
              ...assignment,
              submission: userSubmission || null,
            };
          } catch (err) {
            console.error(`Error fetching submission for ${assignment.title}:`, err);
            return { ...assignment, submission: null };
          }
        })
      );

      setAssignments(updatedAssignments);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleFileUpload = async (event, assignmentId) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!user || !user.id) {
      showModal("Error", "User not found. Please log in again.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:8080/api/olp/submission/submit-assessment?userId=${user.id}&assignmentId=${assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200) {
        showModal("Success", response.data.message || "File uploaded successfully!", "success");
        fetchSubmissionsForAssignments(assignments);
      } else {
        showModal("Warning", response.data.message || "File upload failed!", "warning");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showModal("Error", "Something went wrong while uploading. Please try again.", "error");
    }
  };

  // Load user and assignments
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const loadCoursesAndAssignments = async () => {
        const courses = await fetchEnrolledCourses(user.id);
        if (courses.length > 0) {
          await fetchAssignmentsForCourses(courses);
        } else {
          setLoading(false);
        }
      };
      loadCoursesAndAssignments();
    }
  }, [user]);

  // Determine grade color
  const getGradeColor = (grade) => {
    if (grade >= 85) return "green";
    if (grade >= 50) return "orange";
    return "red";
  };

  return (
    <div className="assignment-list-page">
      <NavHeader />
      <div className="assignment-list-body">
        <NavSideBar />

        <div className="assignment-list-main-content">
          <h2 className="assignment-list-title">My Assignments</h2>
          <p className="assignment-list-subtitle">
            Review your assignments and upload your answers here.
          </p>

          {loading ? (
            <p className="assignment-list-loading">Loading assignments...</p>
          ) : assignments.length > 0 ? (
            <div className="assignment-list-container">
              {assignments.map((assignment, index) => (
                <div key={index} className="assignment-list-card">
                  <div className="assignment-list-info">
                    <h3 className="assignment-list-name">{assignment.title || "Untitled Assignment"}</h3>
                    <p className="assignment-list-course">
                      Course: <span className="assignment-list-course-name">{assignment.courseTitle}</span>
                    </p>
                    <p className="assignment-list-description">
                      {assignment.description || "No description available for this assignment."}
                    </p>

                    {assignment.submission && assignment.submission.grade !== undefined && (
                      <p className="assignment-list-grade">
                        Grade:{" "}
                        <span
                          className="assignment-list-grade-value"
                          style={{ color: getGradeColor(assignment.submission.grade), fontWeight: "bold" }}
                        >
                          {assignment.submission.grade}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="assignment-list-actions">
                    <input
                      type="file"
                      id={`upload-${assignment.id}`}
                      className="assignment-list-file-input"
                      onChange={(e) => handleFileUpload(e, assignment.id)}
                      style={{ display: "none" }}
                    />
                    <button
                      className="assignment-list-upload-btn"
                      style={{
                        backgroundColor: assignment.submission ? "#FFA500" : "#4CAF50",
                        color: "white",
                      }}
                      onClick={() =>
                        document.getElementById(`upload-${assignment.id}`).click()
                      }
                    >
                      {assignment.submission ? "Re-upload Answer" : "Upload Answer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="assignment-list-empty">No assignments available for your enrolled courses.</p>
          )}
        </div>
      </div>

      {modal.show && <Modal title={modal.title} message={modal.message} type={modal.type} onClose={closeModal} />}
    </div>
  );
};

export default AssignmentList;
