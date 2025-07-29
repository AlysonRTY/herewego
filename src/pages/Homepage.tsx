import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <HeroSection />
      <FeaturedSection />
      <Footer />
    </div>
  );
}
