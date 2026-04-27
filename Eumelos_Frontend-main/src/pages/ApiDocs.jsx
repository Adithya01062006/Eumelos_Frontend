import React from 'react';
import './ApiDocs.css';

const apiEndpoints = [
  {
    method: 'POST',
    path: '/auth/student/login',
    description: 'Authenticate a student',
    body: '{\n  "email": "user@example.com",\n  "password": "password123"\n}',
    response: '{\n  "success": true,\n  "message": "Login successful",\n  "id": 1,\n  "name": "John Doe",\n  "role": "STUDENT"\n}'
  },
  {
    method: 'POST',
    path: '/auth/admin/login',
    description: 'Authenticate an administrator',
    body: '{\n  "email": "admin@example.com",\n  "password": "adminpassword"\n}',
    response: '{\n  "success": true,\n  "message": "Admin login successful",\n  "id": 1,\n  "name": "Administrator",\n  "role": "ADMIN"\n}'
  },
  {
    method: 'POST',
    path: '/student/add',
    description: 'Register a new student',
    body: '{\n  "name": "Jane Doe",\n  "password": "password123",\n  "rollno": "CS101",\n  "email": "jane@example.com"\n}',
    response: '{\n  "id": 2,\n  "name": "Jane Doe",\n  "password": "password123",\n  "rollno": "CS101",\n  "email": "jane@example.com"\n}'
  },
  {
    method: 'GET',
    path: '/course/all',
    description: 'Fetch all available courses',
    body: 'No Request Body',
    response: '[\n  {\n    "id": 1,\n    "name": "Data Structures",\n    "facultyName": "Prof. Smith",\n    "credits": 4,\n    "startTime": "10:00:00",\n    "endTime": "12:00:00",\n    "days": "110000"\n  }\n]'
  },
  {
    method: 'POST',
    path: '/course/add',
    description: 'Add a new course (Admin)',
    body: '{\n  "name": "Algorithms",\n  "facultyName": "Dr. Alan",\n  "credits": 3,\n  "startTime": "14:00:00",\n  "endTime": "16:00:00",\n  "days": "001100"\n}',
    response: '{\n  "id": 2,\n  "name": "Algorithms",\n  "facultyName": "Dr. Alan",\n  "credits": 3,\n  "startTime": "14:00:00",\n  "endTime": "16:00:00",\n  "days": "001100"\n}'
  },
  {
    method: 'POST',
    path: '/enrollment/add?studentId={1}&courseId={2}',
    description: 'Enroll a student in a course',
    body: 'No Request Body (Query Params)',
    response: 'Returns String Message (e.g., "Course added successfully")'
  },
  {
    method: 'GET',
    path: '/enrollment/list?studentId={1}',
    description: 'Get all enrollments for a student',
    body: 'No Request Body (Query Param)',
    response: '[List of Courses]'
  },
  {
    method: 'POST',
    path: '/schedule/check?studentId={1}',
    description: 'Check for schedule conflicts before enrolling',
    body: '{ Course JSON Object }',
    response: 'Returns String Message: "Schedule Conflict Detected" or "No Conflict"'
  }
];

const ApiDocs = () => {
  return (
    <div className="api-docs-container">
      <header className="docs-header">
        <h1>API Documentation</h1>
        <p>A reference guide to the Spring Boot Backend Endpoints and expected JSON formats.</p>
      </header>
      
      <div className="docs-content">
        {apiEndpoints.map((endpoint, index) => (
          <div key={index} className="glass-panel endpoint-card">
            <div className="endpoint-header">
              <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                {endpoint.method}
              </span>
              <h2 className="endpoint-path">{endpoint.path}</h2>
            </div>
            
            <p className="endpoint-desc">{endpoint.description}</p>
            
            <div className="code-split">
              <div className="code-block">
                <h3>Request Body / Params</h3>
                <pre><code>{endpoint.body}</code></pre>
              </div>
              
              <div className="code-block">
                <h3>Response</h3>
                <pre><code>{endpoint.response}</code></pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDocs;
