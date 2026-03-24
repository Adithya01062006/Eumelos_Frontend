import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent, loginAdmin } from '../api';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (role === 'student') {
        result = await loginStudent(email, password);
      } else {
        result = await loginAdmin(email, password);
      }

      if (result.success || result.id || result.studentId) {
        // Backend returns: success, message, id, name, role
        localStorage.setItem("isLoggedIn", "true");
        
        // Use backend role if provided, otherwise fallback to local selection
        const userRole = result.role ? result.role.toLowerCase() : role;
        const userId = result.id || result.studentId || 1;
        const userName = result.name || (userRole === 'admin' ? "Administrator" : "Student");

        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userId", userId);
        
        // Keep studentId for backward compatibility if other pages use it specifically
        if (userRole === 'student') {
          localStorage.setItem("studentId", userId);
          localStorage.setItem("studentName", userName);
        } else {
          localStorage.setItem("adminId", userId);
          localStorage.setItem("adminName", userName);
        }

        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server. Check your backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h1 className="auth-title">UniSched</h1>
        <p className="auth-subtitle">Sign in to manage your timetable</p>

        {error && <div className="error-message">{error}</div>}

        <div className="role-selector">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => { setRole('student'); setError(''); }}
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => { setRole('admin'); setError(''); }}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={role === 'student' ? 'student@university.edu' : 'admin@university.edu'}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${role === 'student' ? 'Student' : 'Admin'}`}
          </button>
        </form>

        <div className="auth-footer">
          {role === 'student' && (
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          )}
          <p className="docs-link"><Link to="/api-docs">View API Documentation</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
