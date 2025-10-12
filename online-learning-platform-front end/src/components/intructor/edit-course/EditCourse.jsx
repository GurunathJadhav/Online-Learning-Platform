import React, { useEffect, useState } from "react";
import "./EditCourse.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../../modals/Modal";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
    userId: "",
    modules: [
      {
        title: "",
        lessons: [
          {
            title: "",
            content: "",
          },
        ],
      },
    ],
  });

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "",
  });

  const handleLogout = () => {
    navigate("/");
  };

  // Fetch user & course details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/olp/auth/get-user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/olp/course/get-course-details?courseId=${courseId}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
        );
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course:", error.message);
      }
    };

    fetchCurrentUser();
    fetchCourseDetails();
  }, [courseId, token]);

  // Handlers
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const modules = [...course.modules];
    modules[index][name] = value;
    setCourse({ ...course, modules });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, e) => {
    const { name, value } = e.target;
    const modules = [...course.modules];
    modules[moduleIndex].lessons[lessonIndex][name] = value;
    setCourse({ ...course, modules });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        { title: "", lessons: [{ title: "", content: "" }] },
      ],
    });
  };

  const removeModule = (moduleIndex) => {
    const modules = [...course.modules];
    modules.splice(moduleIndex, 1);
    setCourse({ ...course, modules });
  };

  const addLesson = (moduleIndex) => {
    const modules = [...course.modules];
    modules[moduleIndex].lessons.push({ title: "", content: "" });
    setCourse({ ...course, modules });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const modules = [...course.modules];
    modules[moduleIndex].lessons.splice(lessonIndex, 1);
    setCourse({ ...course, modules });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!course.title || !course.description || !course.price) {
      setModal({
        visible: true,
        title: "Validation Error",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    try {
      const updatedCourse = { ...course, userId: user?.id };
      const response = await axios.put(
        `http://localhost:8080/api/olp/course/edit-course?courseId=${courseId}`,
        updatedCourse,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Course updated:", response.data);

      setModal({
        visible: true,
        title: "Success",
        message: "Course updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      setModal({
        visible: true,
        title: "Error",
        message: "Failed to update course. Please try again!",
        type: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ visible: false, title: "", message: "", type: "" });
    if (modal.type === "success") {
      navigate("/instructor-courses-list");
    }
  };

  return (
    <div className="edit-course-container">
      {/* Header */}
      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="edit-course-main">
        {/* Sidebar */}
        <div className="nav-side-bar">
          <NavSideBar />
        </div>

        {/* Main Content */}
        <div className="edit-course-content-wrapper">
          <div className="edit-course-content">
            <div className="edit-course-header">
              <h2 className="edit-course-title">Edit Course</h2>
              <button
                className="edit-course-back-btn"
                onClick={() => navigate("/instructor-courses-list")}
              >
                ← Back to Courses
              </button>
            </div>

            <form className="edit-course-form" onSubmit={handleSubmit}>
              {/* Course Info */}
              <div className="edit-course-input-group">
                <label>Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleCourseChange}
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="edit-course-input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleCourseChange}
                  placeholder="Enter course description"
                  required
                />
              </div>

              <div className="edit-course-input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={course.price}
                  onChange={handleCourseChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* MODULES SECTION */}
              <div className="edit-course-modules-section">
                <h3>Modules</h3>
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="edit-course-module">
                    <div className="edit-course-module-header">
                      <h4>Module {moduleIndex + 1}</h4>
                      {course.modules.length > 1 && (
                        <button
                          type="button"
                          className="edit-course-remove-btn"
                          onClick={() => removeModule(moduleIndex)}
                        >
                          ✕ Remove Module
                        </button>
                      )}
                    </div>

                    <div className="edit-course-input-group">
                      <label>Module Title</label>
                      <input
                        type="text"
                        name="title"
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, e)}
                        placeholder="Enter module title"
                      />
                    </div>

                    {/* LESSONS */}
                    <div className="edit-course-lessons-section">
                      <h4>Lessons</h4>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="edit-course-lesson">
                          <div className="edit-course-lesson-header">
                            <span>Lesson {lessonIndex + 1}</span>
                            {module.lessons.length > 1 && (
                              <button
                                type="button"
                                className="edit-course-remove-btn"
                                onClick={() =>
                                  removeLesson(moduleIndex, lessonIndex)
                                }
                              >
                                ✕ Remove Lesson
                              </button>
                            )}
                          </div>

                          <div className="edit-course-input-group">
                            <label>Lesson Title</label>
                            <input
                              type="text"
                              name="title"
                              value={lesson.title}
                              onChange={(e) =>
                                handleLessonChange(
                                  moduleIndex,
                                  lessonIndex,
                                  e
                                )
                              }
                              placeholder="Enter lesson title"
                            />
                          </div>

                          <div className="edit-course-input-group">
                            <label>Lesson Content</label>
                            <textarea
                              name="content"
                              value={lesson.content}
                              onChange={(e) =>
                                handleLessonChange(
                                  moduleIndex,
                                  lessonIndex,
                                  e
                                )
                              }
                              placeholder="Enter lesson content"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="edit-course-btn-secondary"
                        onClick={() => addLesson(moduleIndex)}
                      >
                        + Add Lesson
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="edit-course-btn-secondary"
                  onClick={addModule}
                >
                  + Add Module
                </button>
              </div>

              <div className="edit-course-submit">
                <button type="submit" className="edit-course-btn-primary">
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Modal Integration */}
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

export default EditCourse;
