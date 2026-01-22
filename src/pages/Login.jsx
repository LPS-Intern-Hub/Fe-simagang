import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email) => {
    setFormData({
      email: email,
      password: 'password123'
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Logo Petir Balik Lagi */}
          <div className="login-header">
            <div className="brand-login">
              <i className="ri-flashlight-fill"></i>
              <span>SIMAGANG</span>
            </div>
            <h1>Welcome Back!</h1>
            <p>Please login to your account</p>
          </div>

          {error && (
            <div className="alert-error">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="ri-mail-line"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="ri-lock-password-line"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <i className="ri-loader-4-line rotating"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="ri-login-circle-line"></i>
                  Login Now
                </>
              )}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="quick-login">
            <p className="quick-login-title">Quick Login (Testing)</p>
            <div className="quick-login-buttons">
              <button onClick={() => quickLogin('dimas.rizky@intern.com')} className="btn-quick" disabled={loading}>
                <i className="ri-user-line"></i> Intern
              </button>
              <button onClick={() => quickLogin('rina.kartika@mentor.com')} className="btn-quick" disabled={loading}>
                <i className="ri-team-line"></i> Mentor
              </button>
              <button onClick={() => quickLogin('dewi.lestari@sdm.com')} className="btn-quick" disabled={loading}>
                <i className="ri-building-line"></i> SDM
              </button>
            </div>
            <p className="quick-login-note">Password: password123</p>
          </div>

          {/* Taruh di paling bawah setelah div quick-login */}
          <div className="register-footer">
            <p>
              Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
            </p>
          </div>
        </div>

        <div className="login-decoration">
          <div className="deco-circle circle-1"></div>
          <div className="deco-circle circle-2"></div>
          <div className="deco-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;