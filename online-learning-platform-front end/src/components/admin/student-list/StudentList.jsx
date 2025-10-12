import React, { useEffect, useState } from "react";
import "./StudentList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token=localStorage.getItem('token')

  const handleLogout = () => {
    navigate("/");
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/olp/auth/student-list",{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );

      if (response.data && response.data.data) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/olp/auth/delete-user?userId=${id}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      setStudents(students.filter((stu) => stu.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error.message);
      alert("Failed to delete student.");
    }
  };

  // Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/update-student/${id}`);
  };

  const filteredStudents = students.filter((stu) =>
    stu.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-list-container">
      {/* Fixed Header */}
      <div className="student-list-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="student-list-main">
        {/* Sidebar */}
        <div className="student-list-nav-side-bar">
          <NavSideBar />
        </div>

        {/* Content Section */}
        <div className="student-list-content-wrapper">
          <div className="student-list-content">
            <h2 className="student-list-title">Student Management</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search students..."
              className="student-list-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Student Cards */}
            <div className="student-list-grid">
              {filteredStudents.map((student) => (
                <div key={student.id} className="student-list-card">
                  <h3 className="student-list-card-name">
                    {student.username}
                  </h3>
                  <p className="student-list-card-email">📧 {student.email}</p>
                  <p className="student-list-card-id">🆔 ID: {student.id}</p>

                  <div className="student-list-card-actions">
                    <button
                      className="student-list-card-btn update"
                      onClick={() => handleUpdate(student.id)}
                    >
                      Update
                    </button>
                    <button
                      className="student-list-card-btn delete"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && <p>No students found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
