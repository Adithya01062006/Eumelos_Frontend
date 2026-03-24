import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../api';
import './AdminStudents.css';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch student data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-students-page">
      <div className="page-header">
        <h1>Student Roster</h1>
        <p>A complete list of registered students in the system.</p>
      </div>

      {error ? (
        <div className="error-banner">{error}</div>
      ) : loading ? (
        <div className="loader">Loading student database...</div>
      ) : students.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No students are currently registered in the database.</p>
        </div>
      ) : (
        <div className="glass-panel table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td className="font-mono">{student.rollno}</td>
                  <td className="font-medium">{student.name}</td>
                  <td><a href={`mailto:${student.email}`}>{student.email}</a></td>
                  <td><span className="badge-active">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
