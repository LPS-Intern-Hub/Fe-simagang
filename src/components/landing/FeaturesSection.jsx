import styles from "../../styles/Landing.module.css";

const features = [
  {
    icon: "/images/presensi.png",
    title: "Presensi Wajah",
    description:
      "Validasi kehadiran yang akurat menggunakan teknologi deteksi wajah terkini dan verifikasi lokasi GPS.",
  },
  {
    icon: "/images/e-logbook.png",
    title: "E-Logbook Interaktif",
    description:
      "Isi jurnal kegiatan harian secara digital. Mentor mendapatkan notifikasi real-time untuk memberikan persetujuan.",
  },
  {
    icon: "/images/arsip.png",
    title: "Arsip Digital Aman",
    description:
      "Seluruh riwayat aktivitas, laporan, dan penilaian tersimpan aman di cloud dan mudah diakses kapanpun.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="fitur" className={styles.mainFeature}>
      <div className={styles.featureLabel}>FITUR UTAMA</div>
      <h2 className={styles.featureTitle}>Kelola Magang Tanpa Rumit</h2>
      <p className={styles.featureSubtitle}>
        Platform digital yang dirancang untuk efisiensi,
        menghilangkan proses manual yang memakan waktu.
      </p>
      <div className={styles.featureGrid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureItem}>
            <div className={styles.featureIconBox}>
              <img src={feature.icon} alt={feature.title} className={styles.featureIconImg} />
            </div>
            <h4 className={styles.featureItemTitle}>{feature.title}</h4>
            <p className={styles.featureItemDesc}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
