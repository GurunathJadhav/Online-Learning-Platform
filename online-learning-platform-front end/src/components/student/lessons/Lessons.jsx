import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavHeader from "../header-side-bar/NavHeader";
import NavSideBar from "../header-side-bar/NavSideBar";
import axios from "axios";
import "./Lessons.css";

const Lessons = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const token = localStorage.getItem("token");

  const [lessons, setLessons] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  // ✅ Fetch lessons and module title
  const fetchLessons = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/olp/course/lessons-list?courseId=${courseId}&moduleId=${moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data || [];
      setLessons(data);

      if (data.length > 0 && data[0].moduleTitle) {
        setModuleTitle(data[0].moduleTitle);
      } else {
        setModuleTitle("Module Lessons");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId, moduleId]);

  return (
    <div className="enrolled-lesson-page">
      <NavHeader onLogout={handleLogout} />

      <div className="enrolled-lesson-body">
        <NavSideBar />

        <div className="enrolled-lesson-content">
          {loading ? (
            <p className="enrolled-lesson-loading">Loading lessons...</p>
          ) : lessons.length > 0 ? (
            <>
              <h2 className="enrolled-lesson-title">{moduleTitle}</h2>
              <p className="enrolled-lesson-subtitle">
                Explore the complete lesson details below.
              </p>

              <div className="enrolled-lesson-list">
                {lessons.map((lesson, index) => (
                  <div key={index} className="enrolled-lesson-card">
                    <div className="enrolled-lesson-info">
                      <h3 className="enrolled-lesson-name">{lesson.title}</h3>
                      <div
                        className="enrolled-lesson-content-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            lesson.content ||
                            "<p>No description available for this lesson.</p>",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="enrolled-lesson-empty">
              No lessons found for this module.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lessons;