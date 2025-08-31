import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";

export default function Homepage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl" />
      <HeroSection />
      <FeaturedSection />
      <Footer />
    </div>
  );
}
