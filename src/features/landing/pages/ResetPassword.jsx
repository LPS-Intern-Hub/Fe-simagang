import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../../services/api";
import { motion } from "framer-motion";
import styles from "../styles/Login.module.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await requestPasswordReset(email);
      if (response.data.success) {
        setSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim email reset password. Silakan coba lagi.");
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
          <div className={styles.loginTitle}>Lupa Password</div>
          <div className={styles.loginSubtitle}>
            {sent
              ? "Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam."
              : "Silakan masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi melalui email tersebut."
            }
          </div>
          {error && (
            <div style={{ color: "#ff6b00", marginBottom: 12, fontSize: 14 }}>{error}</div>
          )}
          {sent && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              marginBottom: "12px",
              borderRadius: "8px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              fontSize: "13px",
              fontWeight: "500",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span style={{ color: "#16a34a", letterSpacing: "0.01em" }}>Email berhasil dikirim! Periksa inbox Anda.</span>
            </div>
          )}
          <form className={styles.loginForm} onSubmit={handleSubmit} autoComplete="off">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className={styles.loginInput}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={sent || loading}
            />
            <button className={styles.loginBtn} type="submit" disabled={sent || loading}>
              {loading ? "MENGIRIM..." : sent ? "TERKIRIM" : "KIRIM"}
            </button>
          </form>
          <div
            className={styles.resetBackLink}
            onClick={() => navigate("/login")}
          >
            Kembali
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

