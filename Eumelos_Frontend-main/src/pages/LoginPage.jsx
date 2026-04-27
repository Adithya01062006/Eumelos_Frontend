import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent, loginAdmin } from '../api';
import { useUser } from '../context/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();
  const { login, user } = useUser();

  const fetchCaptcha = () => {
    setCaptcha(String(Math.floor(Math.random() * 9000) + 1000));
    setCaptchaInput('');
  };

  useEffect(() => {
    // Check for OAuth2 redirect params in URL first
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token) {
      login(token).then(() => {
        window.history.replaceState({}, '', '/login');
        navigate(role === 'admin' ? '/admin' : '/student');
      });
      return;
    }

    // If already logged in, redirect
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/student');
    }

    fetchCaptcha();
  }, [user, navigate, login]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaInput) {
      setError('Please enter the captcha.');
      return;
    }

    // Verify captcha first
    if (captchaInput !== captcha) {
      setError('Incorrect captcha. Try again.');
      fetchCaptcha();
      return;
    }

    setLoading(true);
    try {
      let result;
      if (role === 'student') {
        result = await loginStudent(email, password);
      } else {
        result = await loginAdmin(email, password);
      }

      if (result.success && result.token) {
        await login(result.token);
      } else {
        setError(result.message || 'Invalid credentials');
        fetchCaptcha();
      }
    } catch (err) {
      setError('Failed to connect to server. Check your backend server.');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h1 className="auth-title">Eumelos</h1>
        <p className="auth-subtitle">Log in to check your timetable</p>

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

          <div className="form-group captcha-group">
            <label>Enter Captcha</label>
            <div className="captcha-display">
              <span className="captcha-code">{captcha}</span>
              <button type="button" onClick={fetchCaptcha} className="captcha-refresh">↻</button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter the 4-digit code"
              maxLength={4}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${role === 'student' ? 'Student' : 'Admin'}`}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className="google-login-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign in with Google
        </button>

        <div className="auth-footer">
          <p>No account yet? <Link to={role === 'admin' ? '/register-admin' : '/register'}>{role === 'admin' ? 'Register as Admin' : 'Register here'}</Link></p>
          <p className="docs-link"><Link to="/api-docs">View API Documentation</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
