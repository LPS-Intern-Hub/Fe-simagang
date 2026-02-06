// Landing Page Components
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import ValueSection from "../components/landing/ValueSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import GuidelineSection from "../components/landing/GuidelineSection";
import FooterSection from "../components/landing/FooterSection";
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
