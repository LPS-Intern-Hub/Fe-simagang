import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    position: '',
    role: 'intern' // Default value sesuai database lu
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      if (res.data.success) {
        alert('Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="login-decoration">
        <div className="deco-circle circle-1"></div>
        <div className="deco-circle circle-2"></div>
      </div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="brand-login">
              <i className="ri-rocket-2-fill"></i>
              <span>Simagang</span>
            </div>
            <h1>Join Us!</h1>
            <p>Create your internship account below</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label><i className="ri-user-line"></i> Full Name</label>
              <input 
                type="text" 
                placeholder="Masukan Nama" 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label><i className="ri-mail-line"></i> Email</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label><i className="ri-lock-line"></i> Password</label>
              <input 
                type="password" 
                placeholder="Min. 6 characters" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>

            {/* Dropdown Role Baru */}
            <div className="form-group">
              <label><i className="ri-shield-user-line"></i> Role</label>
              <select 
                className="form-select" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              >
                <option value="intern">Intern</option>
                <option value="mentor">Mentor</option>
                <option value="SDM">SDM</option>
                <option value="kadiv">Kadiv</option>
              </select>
            </div>

            <div className="form-group">
              <label><i className="ri-briefcase-line"></i> Position</label>
              <input 
                type="text" 
                placeholder="Masukan Posisi Magang" 
                onChange={(e) => setFormData({...formData, position: e.target.value})} 
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <i className="ri-loader-4-line rotating"></i>
              ) : (
                <>Register Now <i className="ri-arrow-right-line"></i></>
              )}
            </button>
          </form>

          <div className="register-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;