import React, { useEffect, useState } from "react";
import "./AddCourse.css";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../modals/Modal";
import Loader from "../../modals/loader/Loader"; // ✅ Import Loader

const AddCourse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false); // ✅ Loader state

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/olp/auth/get-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const currentUser = response.data.data;
        setUser(currentUser);

        // Update course with userId
        setCourse((prev) => ({ ...prev, userId: currentUser.id }));
      } catch (error) {
        console.log("Error fetching user:", error.message);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "",
  });

  const handleLogout = () => {
    navigate("/");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show loader
    try {
      const response = await axios.post(
        "http://localhost:8080/api/olp/course/add-course",
        course,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
      );
      console.log("Course added successfully:", response.data);
      setModal({
        visible: true,
        title: "✅ Success",
        message: "Course added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding course:", error);
      setModal({
        visible: true,
        title: "❌ Error",
        message: "Failed to add course. Please try again!",
        type: "error",
      });
    } finally {
      setLoading(false); // ✅ Hide loader
    }
  };

  const handleCloseModal = () => {
    setModal({ visible: false, title: "", message: "", type: "" });
    if (modal.type === "success") {
      navigate("/instructor/course-list");
    }
  };

  return (
    <div className="add-course-container">
      {/* ✅ Loader Modal */}
      <Loader isOpen={loading} />

      <div className="nav-bar-fixed">
        <NavHeader onLogout={handleLogout} />
      </div>

      <div className="add-course-main">
        <div className="nav-side-bar">
          <NavSideBar />
        </div>

        <div className="add-course-content-wrapper">
          <div className="add-course-content">
            <div className="add-course-header">
              <h2 className="add-course-title">Add New Course</h2>
              <button
                className="add-course-back-btn"
                onClick={() => navigate("/instructor/course-list")}
              >
                ← Back to Courses
              </button>
            </div>

            <form className="add-course-form" onSubmit={handleSubmit}>
              {/* Course Info */}
              <div className="add-course-input-group">
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

              <div className="add-course-input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleCourseChange}
                  placeholder="Enter course description"
                  required
                />
              </div>

              <div className="add-course-grid">
                <div className="add-course-input-group">
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
              </div>

              {/* MODULES SECTION */}
              <div className="add-course-modules-section">
                <h3>Modules</h3>
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="add-course-module">
                    <div className="add-course-module-header">
                      <h4>Module {moduleIndex + 1}</h4>
                      {course.modules.length > 1 && (
                        <button
                          type="button"
                          className="add-course-remove-btn"
                          onClick={() => removeModule(moduleIndex)}
                        >
                          ✕ Remove Module
                        </button>
                      )}
                    </div>

                    <div className="add-course-input-group">
                      <label>Module Title</label>
                      <input
                        type="text"
                        name="title"
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, e)}
                        placeholder="Enter module title"
                        required
                      />
                    </div>

                    {/* LESSONS */}
                    <div className="add-course-lessons-section">
                      <h4>Lessons</h4>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="add-course-lesson">
                          <div className="add-course-lesson-header">
                            <span>Lesson {lessonIndex + 1}</span>
                            {module.lessons.length > 1 && (
                              <button
                                type="button"
                                className="add-course-remove-btn"
                                onClick={() =>
                                  removeLesson(moduleIndex, lessonIndex)
                                }
                              >
                                ✕ Remove Lesson
                              </button>
                            )}
                          </div>

                          <div className="add-course-input-group">
                            <label>Lesson Title</label>
                            <input
                              type="text"
                              name="title"
                              value={lesson.title}
                              onChange={(e) =>
                                handleLessonChange(moduleIndex, lessonIndex, e)
                              }
                              placeholder="Enter lesson title"
                              required
                            />
                          </div>

                          <div className="add-course-input-group">
                            <label>Lesson Content</label>
                            <textarea
                              name="content"
                              value={lesson.content}
                              onChange={(e) =>
                                handleLessonChange(moduleIndex, lessonIndex, e)
                              }
                              placeholder="Enter lesson content"
                              required
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="add-course-btn-secondary"
                        onClick={() => addLesson(moduleIndex)}
                      >
                        + Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-course-btn-secondary"
                  onClick={addModule}
                >
                  + Add Module
                </button>
              </div>

              <div className="add-course-submit">
                <button type="submit" className="add-course-btn-primary">
                  Submit Course
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

export default AddCourse;
