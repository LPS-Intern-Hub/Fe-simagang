import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api";
import { motion } from "framer-motion";
import styles from "../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Redirect based on user role
        const userRole = response.data.data.user.role;
        if (userRole === 'mentor') {
          navigate("/mentor/dashboard");
        } else if (userRole === 'intern') {
          navigate("/dashboard");
        } else if (userRole === 'admin' || userRole === 'SDM' || userRole === 'kadiv') {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.loginContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.loginLeft}>
          <img src="/images/loginLogo.png" alt="Login Logo" className={styles.loginLogo} />
          <div className={styles.loginCopyright}>
            © 2026 Lembaga Penjamin Simpanan. Hak Cipta Dilindungi.
          </div>
        </div>
        <div className={styles.loginRight}>
          <div className={styles.loginTitle}>Selamat Datang di SIMagang</div>
          <div className={styles.loginSubtitle}>Silahkan login untuk melanjutkan</div>
          {error && (
            <div style={{ color: "#ff6b00", marginBottom: 12, fontSize: 14 }}>{error}</div>
          )}
          <form className={styles.loginForm} onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.loginInput}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={styles.loginInput}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            <div
              className={styles.loginForgot}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/reset-password")}
            >
              Lupa Password?
            </div>
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? "Loading..." : "LOG IN"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;