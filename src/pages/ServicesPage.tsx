import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Box, Video, Smartphone, Sparkles, ArrowRight, Star, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientBlinds from "@/components/GradientBlinds";
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
      navigate('/login');
      return;
    }
    navigate(`/services/order/${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Fresh ideas meet cutting-edge technology. As a newly launched creative studio, 
              we're ready to bring your vision to life with passion and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* GradientBlinds Background */}
        <div className="absolute inset-0 z-0">
          <GradientBlinds
            gradientColors={['#D4AF37', '#FFD700', '#FFA500', '#FF8C00']}
            angle={45}
            noise={0.15}
            blindCount={18}
            blindMinWidth={45}
            spotlightRadius={0.65}
            spotlightSoftness={0.9}
            spotlightOpacity={0.75}
            mouseDampening={0.12}
            distortAmount={0}
            shineDirection="right"
            mixBlendMode="lighten"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-[1]" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group relative bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold overflow-hidden">
                  {service.popular && (
                    <div className="absolute -top-0 -right-0 z-10">
                      <div className="bg-accent text-black px-8 py-1.5 shadow-lg transform rotate-45 translate-x-7 translate-y-4 flex items-center justify-center">
                        <Star className="w-3 h-3 mr-1" />
                        <span className="text-xs font-bold">Popular</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-accent/30`}>
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Starting at</span>
                        <span className="text-2xl font-bold text-accent">{service.startingPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Timeline</span>
                        <span className="text-foreground font-medium">{service.timeline}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">What's included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleOrderService(service.title)}
                      className="w-full bg-accent text-black hover:bg-accent/90 font-semibold py-3 rounded-lg transition-all duration-300 shadow-gold group-hover:shadow-lg"
                    >
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Order Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-muted-foreground">
              Let's discuss your vision and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                className="bg-accent text-black hover:bg-accent/90 font-semibold px-8 py-3 shadow-gold"
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
