import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterAdminPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok && data.id) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel register-card">
        <h1 className="auth-title">Admin Register</h1>
        <p className="auth-subtitle">Create an admin account for Eumelos</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form split-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Admin Name" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@university.edu" required />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
            </div>
            <div className="form-group flex-1">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register as Admin'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
