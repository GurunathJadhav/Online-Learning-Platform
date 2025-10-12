import React, { useEffect, useState } from "react";
import "./InstructorCourseList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const InstructorCourseList = () => {
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

      // Extract total pages safely (try message first, then fallback)
      let extractedPages = 1;
      if (data.message) {
        const match = data.message.match(/page numbers?\s+(\d+)/i);
        if (match && match[1]) {
          extractedPages = parseInt(match[1], 10);
        }
      }

      // If backend adds totalPages field later, use it
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
    <div className="instructor-course-list-container">
      {/* Fixed Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="instructor-course-list-main">
        {/* Sidebar */}
        <div className="nav-side-bar">
          <NavSideBar />
        </div>

        <div className="instructor-course-list-content-wrapper">
          <div className="instructor-course-list-content">
            {/* Header Section */}
            <div className="instructor-course-list-header">
              <h2 className="instructor-course-list-title">Course List</h2>

              <button
                className="instructor-course-list-add-btn"
                onClick={() => navigate("/add-course")}
              >
                + Add New Course
              </button>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search courses..."
              className="instructor-course-list-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />

            {/* Course Cards */}
            <div className="instructor-course-list-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="instructor-course-list-card">
                    <h3 className="instructor-course-list-card-title">
                      {course.title}
                    </h3>
                    <p className="instructor-course-list-card-desc">
                      {course.description || "No description available."}
                    </p>

                    <div className="instructor-course-list-card-footer">
                      <Link
                        to={`/instructor-course-details/${course.id}`}
                        className="instructor-course-list-btn"
                      >
                        View Details
                      </Link>
                      <button
                        className="instructor-course-list-btn secondary"
                        onClick={() =>
                          navigate(`/edit-course/${course.id}`)
                        }
                      >
                        Edit Course
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="instructor-course-list-empty">No courses found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="instructor-course-list-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`instructor-pagination-btn ${
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

export default InstructorCourseList;
