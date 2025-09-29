import HeroSection from '../components/Herosection';
import FeaturesSection from '../components/FeaturesSection';
import DashboardPreview from '../components/DashboardPreview';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="font-sans bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="dashboard">
        <DashboardPreview />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}
