import React, { useEffect, useState } from "react";
import "./AdminCourseList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../modals/loader/Loader"; // Loader component

const AdminCourseList = () => {
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  const token=localStorage.getItem('token')

  const handleLogout = () => {
    navigate("/"); // SPA navigation
  };

  // Fetch paginated courses
  const fetchCourses = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/course-list?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          headers:{
            Authorization :`Bearer ${token}`
          }
        }
      ); 

      const data = response.data;
      setCourseList(data.data || []);

      // Extract total pages from response if provided
      const match = data.message?.match(/page numbers\s+(\d+)/i);
      setTotalPages(match && match[1] ? parseInt(match[1], 10) : 1);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const filteredCourses = courseList.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };

  return (
    <div className="admin-course-list-container">
      {/* Loader */}
      <Loader isOpen={loading} />

      {/* Header */}
      <div className="admin-course-list-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="admin-course-list-main">
        {/* Sidebar */}
        <div className="admin-course-list-nav-side-bar">
          <NavSideBar />
        </div>

        {/* Content */}
        <div className="admin-course-list-content-wrapper">
          <div className="admin-course-list-content">
            <h2 className="admin-course-list-title">Admin Course Management</h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search courses..."
              className="admin-course-list-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />

            {/* Courses */}
            <div className="admin-course-list-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="admin-course-list-card">
                    <h3 className="admin-course-list-card-title">{course.title}</h3>
                    <p className="admin-course-list-card-desc">
                      Description: {course.description}
                    </p>
                    <p className="admin-course-list-card-instructor">
                      Instructor: {course.instructor || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="admin-course-list-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`admin-pagination-btn ${
                    currentPage === index ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
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

export default AdminCourseList;
