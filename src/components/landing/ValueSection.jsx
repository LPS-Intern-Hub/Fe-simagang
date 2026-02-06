import styles from "../../styles/Landing.module.css";

const ValueSection = () => {
  const values = [
    {
      icon: "/images/independen.png",
      title: "Independen",
    },
    {
      icon: "/images/integritas.png",
      title: "Integritas",
    },
    {
      icon: "/images/profesional.png",
      title: "Profesional",
    },
  ];

  return (
    <section className={styles.valueSection}>
      <div className={styles.features}>
        {values.map((value, index) => (
          <div key={index} className={styles.featureCard}>
            <img src={value.icon} alt={value.title} className={styles.valueIcon} />
            {value.title}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueSection;
