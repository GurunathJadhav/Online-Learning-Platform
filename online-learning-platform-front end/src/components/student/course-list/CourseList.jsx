import React, { useEffect, useState } from 'react';
import './CourseList.css';
import NavHeader from '../header-side-bar/NavHeader';
import NavSideBar from '../header-side-bar/NavSideBar';
import axios from 'axios';
import {Link,useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate=useNavigate();

  const handleLogout = () => {
    navigate("/")
  };

  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // API expects 0-based index
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // items per page
  const token=localStorage.getItem('token')

  // Fetch paginated courses
  const fetchCourses = async (pageNumber = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/course-list?pageSize=${pageSize}&pageNumber=${pageNumber}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );

      // console.log('API Response:', response.data);

      const data = response.data;
      setCourseList(data.data || []);

      // 🔍 Extract total pages from message, e.g. "Course list with page numbers 2"
      let extractedPages = 1;
      const match = data.message?.match(/page numbers\s+(\d+)/i);
      if (match && match[1]) {
        extractedPages = parseInt(match[1], 10);
      }

      setTotalPages(extractedPages);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    }
  };

  // Fetch when component mounts or page changes
  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  // Filter courses (client-side search)
  const filteredCourses = courseList.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination button click
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1); // UI is 1-based, API is 0-based
  };

  return (
    <div className="course-list-container">
      {/* Fixed header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="course-list-main">
        {/* Sidebar */}
        <div className="nav-side-bar">
          <NavSideBar />
        </div>

        <div className="course-list-content-wrapper">
          <div className="course-list-content">
            <h2 className="course-list-title">Course List</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search courses..."
              className="course-list-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0); // reset to first page on new search
              }}
            />

            {/* Course Cards */}
            <div className="course-list-grid">
              {filteredCourses.map((course) => (
                <div key={course.id} className="course-list-card">
                  <h3 className="course-list-card-title">{course.title}</h3>
                  <p className="course-list-card-instructor">
                    Description: {course.description}
                  </p>
                  <Link to={`/course-details/${course.id}`} className="course-list-card-btn">
                    View Course
                  </Link>

                </div>
              ))}
              {filteredCourses.length === 0 && <p>No courses found.</p>}
            </div>

            {/* Pagination Buttons at Bottom */}
            <div className="course-list-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${currentPage === index ? 'active' : ''}`}
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

export default CourseList;
