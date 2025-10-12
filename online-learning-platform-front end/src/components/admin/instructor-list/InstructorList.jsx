import React, { useEffect, useState } from "react";
import "./InstructorList.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstructorList = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token=localStorage.getItem('token')

  const handleLogout = () => {
    navigate("/");
  };

  // Fetch instructors
  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/olp/auth/instructor-list",{
          headers:{
            Authorization :`Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.data) {
        setInstructors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error.message);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Delete instructor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/olp/auth/instructor/${id}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      setInstructors(instructors.filter((inst) => inst.id !== id));
    } catch (error) {
      console.error("Error deleting instructor:", error.message);
      alert("Failed to delete instructor.");
    }
  };

  // Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/update-instructor/${id}`);
  };

  const filteredInstructors = instructors.filter((inst) =>
    inst.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="instructor-list-container">
      {/* Fixed Header */}
      <div className="instructor-list-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="instructor-list-main">
        {/* Sidebar */}
        <div className="instructor-list-nav-side-bar">
          <NavSideBar />
        </div>

        {/* Content Section */}
        <div className="instructor-list-content-wrapper">
          <div className="instructor-list-content">
            <h2 className="instructor-list-title">Instructor Management</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search instructors..."
              className="instructor-list-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Instructor Cards */}
            <div className="instructor-list-grid">
              {filteredInstructors.map((instructor) => (
                <div key={instructor.id} className="instructor-list-card">
                  <h3 className="instructor-list-card-name">
                    {instructor.username}
                  </h3>
                  <p className="instructor-list-card-email">
                    📧 {instructor.email}
                  </p>
                  <p className="instructor-list-card-id">🆔 ID: {instructor.id}</p>

                  <div className="instructor-list-card-actions">
                    <button
                      className="instructor-list-card-btn update"
                      onClick={() => handleUpdate(instructor.id)}
                    >
                      Update
                    </button>
                    <button
                      className="instructor-list-card-btn delete"
                      onClick={() => handleDelete(instructor.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredInstructors.length === 0 && (
                <p>No instructors found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorList;
