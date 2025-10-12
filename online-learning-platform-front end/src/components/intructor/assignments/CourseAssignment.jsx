import React, { useEffect, useState } from "react";
import "./CourseAssignment.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CourseAssignment = () => {
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const token=localStorage.getItem('token')

  const handleLogout = () => {
    navigate("/");
  };

  const fetchCourses = async (pageNumber = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/course-list?pageSize=${pageSize}&pageNumber=${pageNumber}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );

      const data = response.data;
      console.log("Backend response:", data);

      setCourseList(data.data || []);

      // Extract total pages safely
      let extractedPages = 1;
      if (data.message) {
        const match = data.message.match(/page numbers?\s+(\d+)/i);
        if (match && match[1]) {
          extractedPages = parseInt(match[1], 10);
        }
      }

      if (data.totalPages && data.totalPages > 0) {
        extractedPages = data.totalPages;
      }

      setTotalPages(extractedPages);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const filteredCourses = courseList.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

  return (
    <div className="course-assignments-container">
      {/* Fixed Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="course-assignments-main">
        {/* Sidebar */}
        <div className="nav-side-bar">
          <NavSideBar />
        </div>

        <div className="course-assignments-content-wrapper">
          <div className="course-assignments-content">
            {/* Header Section */}
            <div className="course-assignments-header">
              <h2 className="course-assignments-title">Course Assignments</h2>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search courses..."
              className="course-assignments-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />

            {/* Course Cards */}
            <div className="course-assignments-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="course-assignments-card">
                    <h3 className="course-assignments-card-title">
                      {course.title}
                    </h3>
                    <p className="course-assignments-card-desc">
                      {course.description || "No description available."}
                    </p>

                    <div className="course-assignments-card-footer">
                      <Link
                        to={`/course-assignment-list/${course.id}`}
                        className="course-assignments-btn"
                      >
                        View Assignments
                      </Link>
                      <button
                        className="course-assignments-btn secondary"
                        onClick={() =>
                          navigate(`/add-assignment/${course.id}`)
                        }
                      >
                        + Add Assignment
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="course-assignments-empty">No courses found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="course-assignments-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`course-assignments-pagination-btn ${
                    currentPage === index ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAssignment;
