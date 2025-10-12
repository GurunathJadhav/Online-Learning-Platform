import React, { useEffect, useState } from "react";
import "./CourseAssignmentList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CourseAssignmentList = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams(); // Course ID from route
  const token = localStorage.getItem("token");

  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/assignment/assignment-list?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const filteredAssignments = assignments.filter((a) =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="course-assignment-list-container">
      {/* Fixed Header */}
      <div className="course-assignment-list-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="course-assignment-list-main">
        {/* Sidebar */}
        <div className="course-assignment-list-side-bar">
          <NavSideBar />
        </div>

        {/* Main Content */}
        <div className="course-assignment-list-content-wrapper">
          <div className="course-assignment-list-content">
            <div className="course-assignment-list-header">
              <h2 className="course-assignment-list-title">
                Course Assignments
              </h2>
              <button
                className="course-assignment-list-back-btn"
                onClick={() => navigate("/instructor-courses-list")}
              >
                ← Back to Courses
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search assignments..."
              className="course-assignment-list-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add Assignment Button */}
            <div className="course-assignment-list-add-btn-wrapper">
              <button
                className="course-assignment-list-add-btn"
                onClick={() => navigate(`/add-assignment/${courseId}`)}
              >
                + Add New Assignment
              </button>
            </div>

            {/* Assignment Cards */}
            {loading ? (
              <p className="course-assignment-list-loading">Loading...</p>
            ) : filteredAssignments.length > 0 ? (
              <div className="course-assignment-list-grid">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="course-assignment-list-card"
                  >
                    <h3 className="course-assignment-list-card-title">
                      {assignment.title}
                    </h3>
                    <p className="course-assignment-list-card-desc">
                      {assignment.description || "No description provided."}
                    </p>
                    <p className="course-assignment-list-card-date">
                      Due Date:{" "}
                      <span>
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </span>
                    </p>

                    {/* View Submissions Button */}
                    <button
                      className="course-assignment-list-view-submissions-btn"
                      onClick={() =>
                        navigate(`/assignment-submission-list/${assignment.id}`)
                      }
                    >
                      View Submissions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="course-assignment-list-empty">
                No assignments found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAssignmentList;
