import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import styles from "../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
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
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.loginInput}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
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
      </div>
    </div>
  );
};

export default Login;