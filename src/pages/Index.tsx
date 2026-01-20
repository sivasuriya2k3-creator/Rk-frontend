import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { startAuthPopupAutoShow } from "@/lib/authPopup";

const Index = () => {
  const { user } = useAuth();

  // Initialize auth popup on home page
  useEffect(() => {
    startAuthPopupAutoShow();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds />
      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
