import styles from "../styles/Landing.module.css";

const workTimes = [
  {
    icon: "/images/totalJamKerja.png",
    label: "TOTAL JAM KERJA",
    value: "8 Jam",
    note: "(Di luar istirahat)",
  },
  {
    icon: "/images/jamMasuk.png",
    label: "JAM MASUK (FLEKSI)",
    value: "07.30 - 09.00",
    note: "WIB",
  },
  {
    icon: "/images/jamIstirahat.png",
    label: "JAM ISTIRAHAT",
    value: "12.00 - 13.00",
    note: "WIB",
  },
];

const dressCodes = [
  {
    day: "SENIN",
    icon: "/images/senin.png",
    title: "Kemeja Putih",
    description: "Kemeja/Blouse Putih, Bawahan Bahan, Sepatu Formal.",
  },
  {
    day: "SELASA",
    icon: "/images/selasa.png",
    title: "Batik",
    description: "Baju Batik Rapi, Bawahan Bahan, Sepatu Formal.",
  },
  {
    day: "RABU",
    icon: "/images/rabu.png",
    title: "Warna terang",
    description: "Kemeja Warna Terang, Bawahan Bahan.",
  },
  {
    day: "KAMIS",
    icon: "/images/kamis.png",
    title: "Terang/Batik",
    description: "Bebas rapi (Kemeja/Batik), Bawahan Bahan.",
  },
  {
    day: "JUMAT",
    icon: "/images/jumat.png",
    title: "Smart Casual",
    description: "Kaos Berkerah (Polo), Jeans Gelap (No Ripped).",
  },
];

const GuidelineSection = () => {
  return (
    <section id="aturan" className={styles.guidelineSection}>
      <div className={styles.guidelineLabel}>PEDOMAN & ATURAN</div>
      <h2 className={styles.guidelineTitle}>Jam Kerja & Dresscode</h2>
      <p className={styles.guidelineSubtitle}>
        Panduan profesionalitas selama menjalani masa magang di LPS.
      </p>
      <div className={styles.workTimeGrid}>
        {workTimes.map((time, idx) => (
          <div key={idx} className={styles.workCard}>
            <div className={styles.workIconImgBox}>
              <img src={time.icon} alt={time.label} className={styles.workIconImg} />
            </div>
            <div className={styles.workCardLabel}>{time.label}</div>
            <div className={styles.workCardValue}>{time.value}</div>
            <div className={styles.workCardNote}>{time.note}</div>
          </div>
        ))}
      </div>
      <div className={styles.dresscodeGrid}>
        {dressCodes.map((dress, idx) => (
          <div key={idx} className={styles.dressCard}>
            <div className={styles.dressIconBox}>
              <img src={dress.icon} alt={dress.day} className={styles.dressIconImg} />
            </div>
            <div className={styles.day}>{dress.day}</div>
            <div className={styles.dressCardTitle}>{dress.title}</div>
            <div className={styles.dressCardDesc}>{dress.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuidelineSection;
