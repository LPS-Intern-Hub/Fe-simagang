import styles from "../styles/Landing.module.css";

const FooterSection = () => {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerMain}>
        <img src="/images/navbarLogo.png" alt="SIMAGANG LPS" className={styles.footerLogo} />
        <span className={styles.footerTitle}>SIMAGANG LPS</span>
        <p className={styles.footerDesc}>
          Membangun ekosistem magang yang transparan dan akuntabel di lingkungan Lembaga Penjamin Simpanan Indonesia.
        </p>
      </div>
      <hr className={styles.footerDivider} />
      <div className={styles.footerCopyright}>
        © 2026 Lembaga Penjamin Simpanan. Hak Cipta Dilindungi.
      </div>
    </footer>
  );
};

export default FooterSection;
