import { Link } from "react-router-dom";
import styles from "../styles/Landing.module.css";

const Landing = () => {
  return (
    <div className={styles.wrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>⚡ SIMAGANG</div>

        <ul className={styles.navLinks}>
          <li>Tentang LPS</li>
          <li>Fitur</li>
          <li>Aturan</li>
          <li>
            <Link to="/login" className={styles.loginBtn}>
              Login Peserta
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <span className={styles.badge}>🛡 Aku Aman, Ada LPS</span>

        <h1 className={styles.title}>
          Sistem Manajemen Magang <br />
          <span>Lembaga Penjamin Simpanan</span>
        </h1>

        <p className={styles.subtitle}>
          Platform terintegrasi untuk mendukung kegiatan magang yang
          produktif, transparan, dan profesional di lingkungan LPS.
        </p>

        <div className={styles.content}>
          <div className={styles.textBox}>
            <h3>Mengenal LPS</h3>
            <p>
              Lembaga Penjamin Simpanan (LPS) adalah lembaga independen
              yang dibentuk berdasarkan UU No. 24 Tahun 2004.
            </p>
            <p>
              Kami hadir untuk menjamin simpanan nasabah dan menjaga
              stabilitas sistem perbankan nasional.
            </p>
          </div>

          {/* LOGO DIGANTI GAMBAR */}
          <div className={styles.logoBox}>
            <img
              src="/lps.png"
              alt="Logo LPS"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className={styles.valueSection}>
        <div className={styles.features}>
          <div className={styles.featureCard}>🧭 Independen</div>
          <div className={styles.featureCard}>🛡 Integritas</div>
          <div className={styles.featureCard}>👔 Profesional</div>
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section className={styles.mainFeature}>
        <span className={styles.featureLabel}>FITUR UTAMA</span>

        <h2 className={styles.featureTitle}>Kelola Magang Tanpa Rumit</h2>

        <p className={styles.featureSubtitle}>
          Platform digital yang dirancang untuk efisiensi,
          menghilangkan proses manual yang memakan waktu.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🎯</div>
            <h4>Presensi Wajah</h4>
            <p>
              Validasi kehadiran yang akurat menggunakan teknologi
              deteksi wajah terkini dan verifikasi lokasi GPS.
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📘</div>
            <h4>E-Logbook Interaktif</h4>
            <p>
              Isi jurnal kegiatan harian secara digital. Mentor
              mendapatkan notifikasi real-time untuk persetujuan.
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🗄</div>
            <h4>Arsip Digital Aman</h4>
            <p>
              Seluruh riwayat aktivitas, laporan, dan penilaian
              tersimpan aman di cloud dan mudah diakses kapanpun.
            </p>
          </div>
        </div>
      </section>

      {/* PEDOMAN & ATURAN */}
      <section className={styles.guidelineSection}>
        <span className={styles.guidelineLabel}>PEDOMAN & ATURAN</span>

        <h2 className={styles.guidelineTitle}>Jam Kerja & Dresscode</h2>

        <p className={styles.guidelineSubtitle}>
          Panduan profesionalitas selama menjalani masa magang di LPS.
        </p>

        <div className={styles.workTimeGrid}>
          <div className={styles.workCard}>
            <div className={styles.workIcon}>🕘</div>
            <small>Total Jam Kerja</small>
            <h4>8 Jam</h4>
            <span>(Di luar istirahat)</span>
          </div>

          <div className={styles.workCard}>
            <div className={styles.workIcon}>➡️</div>
            <small>Jam Masuk (Fleksi)</small>
            <h4>07.30 – 09.00</h4>
            <span>WIB</span>
          </div>

          <div className={styles.workCard}>
            <div className={styles.workIcon}>🍽️</div>
            <small>Jam Istirahat</small>
            <h4>12.00 – 13.00</h4>
            <span>WIB</span>
          </div>
        </div>

        <div className={styles.dresscodeGrid}>
          <div className={styles.dressCard}>
            <span className={styles.day}>SENIN</span>
            <h4>Kemeja Putih</h4>
            <p>Kemeja/Blouse Putih, Bawahan Bahan, Sepatu Formal.</p>
          </div>

          <div className={styles.dressCard}>
            <span className={styles.day}>SELASA</span>
            <h4>Batik</h4>
            <p>Baju Batik Rapi, Bawahan Bahan, Sepatu Formal.</p>
          </div>

          <div className={styles.dressCard}>
            <span className={styles.day}>RABU</span>
            <h4>Warna Terang</h4>
            <p>Kemeja Warna Terang, Bawahan Bahan.</p>
          </div>

          <div className={styles.dressCard}>
            <span className={styles.day}>KAMIS</span>
            <h4>Terang / Batik</h4>
            <p>Bebas rapi (Kemeja/Batik), Bawahan Bahan.</p>
          </div>

          <div className={styles.dressCard}>
            <span className={styles.day}>JUMAT</span>
            <h4>Smart Casual</h4>
            <p>Kaos Berkerah (Polo), Jeans Gelap (No Ripped).</p>
          </div>
        </div>
      </section>

      {/* SIMAGANG SECTION */}
      <section className="simagang">
        <div className="simagang-container">
          <div className="simagang-logo">
            <img src="icon-simagang.svg" alt="SIMAGANG LPS" />
            <h2>SIMAGANG LPS</h2>
          </div>
          <p className="simagang-desc">
            Membangun ekosistem magang yang transparan dan akuntabel di
            lingkungan Lembaga Penjamin Simpanan Indonesia.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
