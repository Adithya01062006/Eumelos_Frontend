import React, { useState, useEffect } from 'react';
import { getAllCourses, getAllStudents, deleteCourse } from '../api';
import './AdminHome.css';

const AdminHome = () => {
  const [metrics, setMetrics] = useState({ courses: 0, students: 0 });
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, loading: false, error: '' });

  const fetchData = async () => {
    try {
      const [coursesData, studentsData] = await Promise.all([
        getAllCourses(),
        getAllStudents()
      ]);
      setCoursesList(coursesData || []);
      setMetrics({
        courses: coursesData.length || 0,
        students: studentsData.length || 0
      });
    } catch (err) {
      console.error("Failed to load admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if(!window.confirm("Are you sure you want to delete this course? All related enrollments will be permanently removed.")) return;
    
    setDeleteStatus({ id: courseId, loading: true, error: '' });
    try {
      await deleteCourse(courseId);
      await fetchData(); // Refresh the list
      setDeleteStatus({ id: null, loading: false, error: '' });
    } catch (err) {
      console.error("Delete failed", err);
      setDeleteStatus({ id: courseId, loading: false, error: 'Failed to delete course' });
    }
  };

  return (
    <div className="admin-home">
      <div className="admin-banner glass-panel">
        <div className="banner-content">
          <h1>Admin Overview</h1>
          <p>System statistics and quick actions to manage UniSched.</p>
        </div>
        <div className="banner-icon">⚙️</div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-panel">
          <div className="stat-header">
            <h3>Registered Students</h3>
            <span className="stat-icon users-icon">👥</span>
          </div>
          <p className="admin-stat-number">{loading ? '-' : metrics.students}</p>
          <a href="/admin/students" className="stat-link">View all students →</a>
        </div>

        <div className="admin-stat-card glass-panel">
          <div className="stat-header">
            <h3>Total Courses</h3>
            <span className="stat-icon catalog-icon">📋</span>
          </div>
          <p className="admin-stat-number">{loading ? '-' : metrics.courses}</p>
          <a href="/admin/add-course" className="stat-link">Add new course →</a>
        </div>
        
        <div className="admin-stat-card glass-panel">
          <div className="stat-header">
            <h3>System Status</h3>
            <span className="stat-icon status-icon">🟢</span>
          </div>
          <p className="admin-stat-number text-success">Online</p>
          <span className="stat-link quiet-link">Connected to Spring Boot API</span>
        </div>
      </div>

      <div className="admin-courses-section glass-panel">
        <div className="section-header">
          <h2>Active Courses ({coursesList.length})</h2>
          <a href="/admin/add-course" className="btn-primary-sm">+ Add Course</a>
        </div>

        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Credits</th>
                <th>Days</th>
                <th>Times</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading courses...</td></tr>
              ) : coursesList.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No courses found.</td></tr>
              ) : (
                coursesList.map(course => (
                  <tr key={course.id}>
                    <td><strong>{course.name}</strong></td>
                    <td>{course.facultyName}</td>
                    <td>{course.credits}</td>
                    <td><span className="badge-days">{course.days}</span></td>
                    <td>{course.startTime} - {course.endTime}</td>
                    <td>
                      <button 
                        className="btn-delete-course"
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deleteStatus.id === course.id && deleteStatus.loading}
                      >
                        {(deleteStatus.id === course.id && deleteStatus.loading) ? 'Deleting...' : 'Delete'}
                      </button>
                      {deleteStatus.id === course.id && deleteStatus.error && (
                        <div className="error-text sm">{deleteStatus.error}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
