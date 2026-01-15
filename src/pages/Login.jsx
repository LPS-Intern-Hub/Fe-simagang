import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      
      if (response.data.success) {
        // Save token and user data to localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
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
          {/* Logo & Title */}
          <div className="login-header">
            <div className="brand-login">
              <i className="ri-flashlight-fill"></i>
              <span>SIMAGANG</span>
            </div>
            <h1>Selamat Datang!</h1>
            <p>Silakan login untuk melanjutkan</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert-error">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="ri-mail-line"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
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
                placeholder="Masukkan password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <i className="ri-loader-4-line rotating"></i>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="ri-login-circle-line"></i>
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Quick Login for Testing */}
          <div className="quick-login">
            <p className="quick-login-title">Quick Login (Testing)</p>
            <div className="quick-login-buttons">
              <button 
                onClick={() => quickLogin('dimas.rizky@intern.com')}
                className="btn-quick"
                disabled={loading}
              >
                <i className="ri-user-line"></i>
                Intern
              </button>
              <button 
                onClick={() => quickLogin('rina.kartika@mentor.com')}
                className="btn-quick"
                disabled={loading}
              >
                <i className="ri-team-line"></i>
                Mentor
              </button>
              <button 
                onClick={() => quickLogin('dewi.lestari@sdm.com')}
                className="btn-quick"
                disabled={loading}
              >
                <i className="ri-building-line"></i>
                SDM
              </button>
            </div>
            <p className="quick-login-note">Password: password123</p>
          </div>
        </div>

        {/* Decorative Elements */}
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
