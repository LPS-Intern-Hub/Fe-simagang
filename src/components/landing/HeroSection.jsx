import styles from "../../styles/Landing.module.css";

const HeroSection = () => {
  return (
    <section id="tentang-lps" className={styles.hero}>
      <div className={styles.heroTop}>
        <div className={styles.badge}>
          <img src="/images/kuAman.png" alt="Ku Aman" className={styles.badgeIcon} />
          "Ku Aman, Ada LPS"
        </div>

        <h1 className={styles.title}>
          Sistem Manajemen Magang <br />
          <span>Lembaga Penjamin Simpanan</span>
        </h1>

        <p className={styles.subtitle}>
          Platform terintegrasi untuk mendukung kegiatan magang yang
          produktif, transparan, dan profesional di lingkungan LPS.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.textBox}>
          <h3 className={styles.sectionLabel}>MENGENAL LPS</h3>
          <p className={styles.description}>
            <strong>Lembaga Penjamin Simpanan</strong> (LPS) adalah lembaga
            independen yang dibentuk berdasarkan UU No. 24 Tahun 2004. Kami hadir untuk menjamin simpanan nasabah dan
            menjaga stabilitas sistem perbankan nasional.
          </p>
          <p className={styles.description}>
            Sebagai peserta magang, Anda menjadi bagian dari
            ekosistem yang menjunjung tinggi integritas, fokus pada
            pelayanan publik, dan standar kerja profesional.
          </p>
        </div>

        <div className={styles.logoBox}>
          <img
            src="/images/lps.png"
            alt="Logo LPS"
            className={styles.logoImage}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
