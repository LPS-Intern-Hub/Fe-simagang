import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../../../services/api";
import Modal from "../../shared/components/Modal";
import { motion } from "framer-motion";
import styles from "../styles/Login.module.css";

const NewPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });


    // Verify token on mount
    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyResetToken(token);
                setTokenValid(true);
            } catch (err) {
                setError(err.response?.data?.message || "Token tidak valid atau sudah kadaluarsa");
                setTokenValid(false);
            } finally {
                setVerifying(false);
            }
        };
        checkToken();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const passwordsMatch = formData.newPassword && formData.confirmPassword &&
        formData.newPassword === formData.confirmPassword;
    const passwordsDontMatch = formData.newPassword && formData.confirmPassword &&
        formData.newPassword !== formData.confirmPassword;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(token, formData.newPassword);
            if (response.data.success) {
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Password Berhasil Direset!',
                    message: response.data.message
                });
            }
        } catch (err) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Reset Password Gagal',
                message: err.response?.data?.message || 'Gagal mereset password. Silakan coba lagi.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.type === 'success') {
            navigate("/login");
        }
    };


    if (verifying) {
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
                        <div className={styles.loginTitle}>Memverifikasi Token...</div>
                        <div className={styles.loginSubtitle}>
                            Mohon tunggu sebentar.
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!tokenValid) {
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
                        <div className={styles.loginTitle}>Token Tidak Valid</div>
                        <div className={styles.loginSubtitle}>
                            {error}
                        </div>
                        <div
                            className={styles.resetBackLink}
                            onClick={() => navigate("/login")}
                        >
                            Kembali ke Login
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                    <div className={styles.loginTitle}>Buat Password Baru</div>
                    <div className={styles.loginSubtitle}>
                        Silakan masukkan password baru Anda. Password minimal 6 karakter.
                    </div>
                    {error && (
                        <div style={{ color: "#ff6b00", marginBottom: 12, fontSize: 14 }}>{error}</div>
                    )}
                    <form className={styles.loginForm} onSubmit={handleSubmit} autoComplete="off">
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Password Baru"
                                className={styles.loginInput}
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? (
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
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Konfirmasi Password Baru"
                                className={styles.loginInput}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
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

                        {/* Password Match Indicator - Elegant Design */}
                        {formData.confirmPassword && (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 14px",
                                marginTop: "-6px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                                backgroundColor: passwordsMatch ? "#f0fdf4" : "#fef2f2",
                                border: passwordsMatch ? "1px solid #86efac" : "1px solid #fecaca",
                                transition: "all 0.2s ease",
                                fontSize: "13px",
                                fontWeight: "500",
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}>
                                {passwordsMatch ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        <span style={{ color: "#16a34a", letterSpacing: "0.01em" }}>Password cocok</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                        </svg>
                                        <span style={{ color: "#dc2626", letterSpacing: "0.01em" }}>Password tidak cocok</span>
                                    </>
                                )}
                            </div>
                        )}

                        <button className={styles.loginBtn} type="submit" disabled={loading || !passwordsMatch}>
                            {loading ? "MEMPROSES..." : "RESET PASSWORD"}
                        </button>
                    </form>
                    <div
                        className={styles.resetBackLink}
                        onClick={() => navigate("/login")}
                    >
                        Kembali ke Login
                    </div>
                </div>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
            </motion.div>
        </div>
    );
};

export default NewPassword;

