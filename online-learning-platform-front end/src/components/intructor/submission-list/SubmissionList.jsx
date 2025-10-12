import React, { useEffect, useState } from "react";
import "./SubmissionList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SubmissionList = () => {
  const navigate = useNavigate();
  const { id: assignmentId } = useParams(); // assignmentId from route
  const token = localStorage.getItem("token");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({}); // store grade inputs

  const handleLogout = () => {
    navigate("/");
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/submission/submission-list?assignmentId=${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Ensure we always have an array
      const fetchedSubmissions = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setSubmissions(fetchedSubmissions);

      // Initialize grades state safely
      const initialGrades = {};
      fetchedSubmissions.forEach((submission) => {
        initialGrades[submission?.id ?? Math.random()] =
          submission?.grade ?? "";
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (submissionId, value) => {
    setGrades((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const handleGradeSubmit = async (submissionId) => {
    const gradeValue = grades[submissionId];
    if (gradeValue === "" || gradeValue === null || gradeValue === undefined) {
      alert("Please enter a grade before submitting.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/olp/submission/assign-grade?submissionId=${submissionId}&grade=${gradeValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Grade "${gradeValue}" submitted successfully!`);

      // Update submission grade locally
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission?.id === submissionId
            ? { ...submission, grade: gradeValue }
            : submission
        )
      );
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert("Failed to submit grade. Try again!");
    }
  };

  return (
    <div className="assignment-submission-list-container">
      {/* Header */}
      <div className="assignment-submission-list-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="assignment-submission-list-main">
        {/* Sidebar */}
        <div className="assignment-submission-list-side-bar">
          <NavSideBar />
        </div>

        {/* Content */}
        <div className="assignment-submission-list-content-wrapper">
          <div className="assignment-submission-list-content">
            <div className="assignment-submission-list-header">
              <h2 className="assignment-submission-list-title">
                Assignment Submissions
              </h2>
              <button
                className="assignment-submission-list-back-btn"
                onClick={() =>
                  navigate(`/instructor/course/${assignmentId}/assignments`)
                }
              >
                ← Back to Assignments
              </button>
            </div>

            {loading ? (
              <p className="assignment-submission-list-loading">Loading...</p>
            ) : submissions.length === 0 ? (
              <p className="assignment-submission-list-empty">
                No submissions found for this assignment.
              </p>
            ) : (
              <div className="assignment-submission-list-grid">
                {submissions.map((submission) => {
                  const subId = submission?.id ?? Math.random();
                  return (
                    <div
                      key={subId}
                      className="assignment-submission-list-card"
                    >
                      <h3 className="assignment-submission-list-card-title">
                        {submission?.assignmentTitle ?? "Untitled Assignment"}
                      </h3>

                      <p className="assignment-submission-list-card-info">
                        <strong>Submitted By:</strong>{" "}
                        {submission?.username ?? "Unknown User"}
                      </p>

                      <p className="assignment-submission-list-card-info">
                        <strong>Course:</strong>{" "}
                        {submission?.courseTitle ?? "Unknown Course"}
                      </p>

                      <div className="assignment-submission-list-card-content">
                        <strong>Content:</strong>
                        <pre>{submission?.content ?? "No content provided"}</pre>
                      </div>

                      <div className="assignment-submission-list-grade-section">
                        <input
                          type="text"
                          className="assignment-submission-list-grade-input"
                          placeholder="Enter grade"
                          value={grades[subId] ?? ""}
                          onChange={(e) =>
                            handleGradeChange(subId, e.target.value)
                          }
                        />
                        <button
                          className="assignment-submission-list-grade-btn"
                          onClick={() => handleGradeSubmit(subId)}
                        >
                          Give Grade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionList;
