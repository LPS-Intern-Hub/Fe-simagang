import { Link } from "react-router-dom";
import styles from "../styles/Landing.module.css";

const LandingNavbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/images/navbarLogo.png" alt="Logo" className={styles.logoIcon} />
        SIMAGANG
      </div>

      <ul className={styles.navLinks}>
        <li onClick={() => scrollToSection("tentang-lps")} style={{ cursor: "pointer" }}>
          Tentang LPS
        </li>
        <li onClick={() => scrollToSection("fitur")} style={{ cursor: "pointer" }}>
          Fitur
        </li>
        <li onClick={() => scrollToSection("aturan")} style={{ cursor: "pointer" }}>
          Aturan
        </li>
        <li>
          <Link to="/login" className={styles.loginBtn}>
            Login Peserta
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LandingNavbar;
