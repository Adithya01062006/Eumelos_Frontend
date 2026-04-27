import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../api';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollno: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const studentData = {
        name: formData.name,
        email: formData.email,
        rollno: formData.rollno,
        password: formData.password
      };
      
      const result = await registerStudent(studentData);
      if (result.id) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to server. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel register-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Eumelos to manage your classes</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form split-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe"
                required 
              />
            </div>
            
            <div className="form-group flex-1">
              <label>Roll Number</label>
              <input 
                type="text" 
                name="rollno"
                value={formData.rollno} 
                onChange={handleChange} 
                placeholder="CS123456"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="student@university.edu"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Create password"
                required 
              />
            </div>

            <div className="form-group flex-1">
              <label>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Confirm password"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
