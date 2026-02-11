// Landing Page Components
import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import ValueSection from "../components/ValueSection";
import FeaturesSection from "../components/FeaturesSection";
import GuidelineSection from "../components/GuidelineSection";
import FooterSection from "../components/FooterSection";
import styles from "../styles/Landing.module.css";

const Landing = () => {
  return (
    <div className={styles.wrapper}>
      <LandingNavbar />
      <HeroSection />
      <ValueSection />
      <FeaturesSection />
      <GuidelineSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
