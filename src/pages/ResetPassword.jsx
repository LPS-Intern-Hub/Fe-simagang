import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
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
          <div className={styles.loginTitle}>Reset Password</div>
          <div className={styles.loginSubtitle}>
            Tambahkan alamat email yang terkait dengan akunmu dan kami akan mengirimkan tautan untuk memperbarui password
          </div>
          <form className={styles.loginForm} onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="email" style={{fontWeight:500,marginBottom:8,fontSize:14,color:'#222'}}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="input your email"
              className={styles.loginInput}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={sent}
              style={{marginBottom:22}}
            />
            <button className={styles.loginBtn} type="submit" disabled={sent} style={{background:'#FF6B00',color:'#fff',borderColor:'#FF6B00'}}>
              {sent ? "Email Sent!" : "Send Email"}
            </button>
          </form>
          <div
            style={{color:'#63687a',fontSize:15,textAlign:'center',marginTop:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:4,userSelect:'none'}}
            onClick={() => navigate("/login")}
          >
            <span style={{fontSize:18,marginRight:2}}>←</span> Back to Sign In
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
