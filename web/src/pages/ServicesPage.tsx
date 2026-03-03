import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Box, Video, Smartphone, Sparkles, ArrowRight, Star, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: Code,
      title: "Web Design & Development",
      description: "Custom websites built with modern technologies, optimized for performance and user experience.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile First"],
      startingPrice: "₹2,07,500",
      timeline: "2-4 weeks",
      popular: true
    },
    {
      icon: Palette,
      title: "Branding & Identity",
      description: "Comprehensive brand strategies that capture your essence and resonate with your audience.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"],
      startingPrice: "₹1,24,500",
      timeline: "1-2 weeks",
      popular: false
    },
    {
      icon: Box,
      title: "3D Animation",
      description: "Stunning 3D visuals and animations that bring your concepts to life with cinematic quality.",
      gradient: "from-accent/20 to-accent/10",
      features: ["3D Modeling", "Motion Graphics", "Product Visualization", "Character Animation"],
      startingPrice: "₹2,49,000",
      timeline: "3-6 weeks",
      popular: false
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Professional video content that tells your story and engages your audience effectively.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Script Writing", "HD Video", "Editing", "Sound Design"],
      startingPrice: "₹1,66,000",
      timeline: "2-4 weeks",
      popular: false
    },
    {
      icon: Smartphone,
      title: "UI/UX Design",
      description: "Intuitive interfaces designed with user-centered principles for maximum engagement.",
      gradient: "from-accent/20 to-accent/10",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
      startingPrice: "₹1,49,400",
      timeline: "2-3 weeks",
      popular: false
    },
    {
      icon: Sparkles,
      title: "Digital Strategy",
      description: "Data-driven strategies that align with your business goals and drive measurable results.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Market Analysis", "Content Strategy", "Social Media", "Performance Tracking"],
      startingPrice: "₹99,600",
      timeline: "1-2 weeks",
      popular: false
    },
  ];

  const handleOrderService = (serviceTitle: string) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('showAuthPopup'));
      return;
    }
    navigate(`/services/order/${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* GradientBlinds Background */}
        <div className="absolute inset-0 z-0">
          <GradientBlinds
            gradientColors={['#D4AF37', '#F4C542', '#FFD700']}
            angle={45}
            noise={0.15}
            blindCount={10}
            blindMinWidth={100}
            spotlightRadius={0.55}
            spotlightSoftness={1.0}
            spotlightOpacity={0.6}
            mouseDampening={0.25}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            dpr={0.75}
            slideDirection="left"
            slideDuration={1.2}
            slideDelay={0}
          />
        </div>
        
        {/* Overlay for content readability */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(244, 197, 66, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              Our Services
            </h1>
            <p className="text-base md:text-lg lg:text-2xl text-white max-w-2xl mx-auto" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.3)'
            }}>
              Fresh ideas meet cutting-edge technology. As a newly launched creative studio, 
              we're ready to bring your vision to life with passion and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-24 relative overflow-hidden">

        {/* Content */}
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleOrderService(service.title)}
                  className="group relative text-left transition-all duration-300 rounded-lg overflow-hidden cursor-pointer"
                >
                  <Card className="relative bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold overflow-hidden h-full before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent/0 before:via-accent/20 before:to-accent/0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none">
                    {service.popular && (
                      <div className="absolute -top-0 -right-0 z-10">
                        <div className="bg-accent px-8 py-1.5 shadow-lg transform rotate-45 translate-x-7 translate-y-4 flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1 text-white dark:text-black" />
                          <span className="text-xs font-bold text-white dark:text-black">Popular</span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-3 md:pb-4">
                      <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 border border-accent/30`}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                      </div>
                      <CardTitle className="text-base md:text-lg lg:text-xl font-bold text-foreground dark:text-white mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm text-foreground dark:text-white">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 md:space-y-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between items-center text-xs md:text-sm">
                            <span className="text-foreground dark:text-white">Starting at</span>
                            <span className="text-lg md:text-2xl font-bold text-accent">{service.startingPrice}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs md:text-sm">
                            <span className="text-foreground dark:text-white">Timeline</span>
                            <span className="text-foreground dark:text-white font-medium">{service.timeline}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-4 md:mt-6">
                          <h4 className="font-semibold text-xs md:text-sm text-foreground dark:text-white">What's included:</h4>
                          <ul className="space-y-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="text-xs md:text-sm text-foreground dark:text-white flex items-center">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-secondary/30 dark:bg-background shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(244, 197, 66, 0.3), 0 2px 15px rgba(0, 0, 0, 0.8)'
            }}>
              Ready to Start Your Project?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(212, 175, 55, 0.3)'
            }}>
              Let's discuss your vision and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Update URL with query param
                    window.history.replaceState(null, '', '/?type=consultation#contact');
                  }, 100);
                }}
                className="bg-accent hover:bg-accent/90 font-semibold px-8 py-3 shadow-gold"
              >
                Get Free Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/#portfolio')}
                className="border-border bg-transparent text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent px-8 py-3"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;
