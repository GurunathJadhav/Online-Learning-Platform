import React, { useState } from "react";
import "./AddAssignment.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../../modals/Modal";
import Loader from "../../modals/loader/Loader"; // ✅ Import loader

const AddAssignment = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const token = localStorage.getItem("token");

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: courseId || "",
  });

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false); // ✅ Loader state

  const handleLogout = () => {
    navigate("/");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dueDate") {
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      setAssignment({ ...assignment, dueDate: formattedDate });
    } else {
      setAssignment({ ...assignment, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show loader
    try {
      const payload = { ...assignment };

      const response = await axios.post(
        "http://localhost:8080/api/olp/assignment/add-assignment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Assignment added successfully:", response.data);

      setModal({
        visible: true,
        title: "Success",
        message: "Assignment added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding assignment:", error);
      setModal({
        visible: true,
        title: "Error",
        message:
          error?.response?.data?.data ||
          "Failed to add assignment. Please try again!",
        type: "error",
      });
    } finally {
      setLoading(false); // ✅ Hide loader
    }
  };

  const handleCloseModal = () => {
    setModal({ visible: false, title: "", message: "", type: "" });
    if (modal.type === "success") {
      navigate(`/course-assignment-list/${courseId}`);
    }
  };

  return (
    <div className="add-assignment-container">
      {/* ✅ Loader */}
      <Loader isOpen={loading} />

      <div className="add-assignment-nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="add-assignment-main">
        <div className="add-assignment-side-bar">
          <NavSideBar />
        </div>

        <div className="add-assignment-content-wrapper">
          <div className="add-assignment-content">
            <div className="add-assignment-header">
              <h2 className="add-assignment-title">Add New Assignment</h2>
              <button
                className="add-assignment-back-btn"
                onClick={() =>
                  navigate(`/instructor/course/${courseId}/assignments`)
                }
              >
                ← Back to Assignments
              </button>
            </div>

            <form className="add-assignment-form" onSubmit={handleSubmit}>
              <div className="add-assignment-input-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  value={assignment.title}
                  onChange={handleChange}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="add-assignment-input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={assignment.description}
                  onChange={handleChange}
                  placeholder="Enter assignment description"
                  required
                />
              </div>

              <div className="add-assignment-input-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={
                    assignment.dueDate
                      ? assignment.dueDate.split("/").reverse().join("-")
                      : ""
                  }
                  onChange={handleChange}
                  required
                />
                {assignment.dueDate && (
                  <p className="add-assignment-date-display">
                    Selected Date: {assignment.dueDate}
                  </p>
                )}
              </div>

              <div className="add-assignment-submit">
                <button type="submit" className="add-assignment-btn-primary">
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {modal.visible && (
        <Modal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AddAssignment;
