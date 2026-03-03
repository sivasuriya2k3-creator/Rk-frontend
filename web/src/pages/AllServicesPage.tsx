import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Box, Video, Smartphone, Sparkles, ArrowRight, Star, Users, Clock, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

const AllServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 1,
      icon: Code,
      title: "Web Design & Development",
      category: "web",
      description: "Custom websites built with modern technologies, optimized for performance and user experience. Complete end-to-end web solutions.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile First", "CMS Integration", "E-commerce Ready"],
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹6,00,000",
      pricingUnit: "",
      timeline: "2-4 weeks (aprx)",
      popular: true,
      deliverables: ["Homepage", "Inner Pages", "Mobile Version", "Admin Panel", "Source Code", "Documentation"]
    },
    {
      id: 2,
      icon: Palette,
      title: "Branding & Identity",
      category: "design",
      description: "Comprehensive brand strategies that capture your essence and resonate with your audience. Complete visual identity solutions.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography", "Business Cards", "Stationery"],
      startingPrice: 1000,
      priceRange: "₹1,000 - ₹1,00,000",
      pricingUnit: "",
      timeline: "1-2 weeks (aprx)",
      popular: false,
      deliverables: ["Logo Files", "Brand Book", "Style Guide", "Print Materials", "Digital Assets", "Usage Guidelines"]
    },
    {
      id: 3,
      icon: Box,
      title: "3D Animation",
      category: "video",
      description: "Stunning 3D visuals and animations that bring your concepts to life with cinematic quality. Professional 3D content creation.",
      gradient: "from-accent/20 to-accent/10",
      features: ["3D Modeling", "Motion Graphics", "Product Visualization", "Character Animation", "Rendering", "Post-Production"],
      startingPrice: 2111,
      priceRange: "₹2,111 - ₹8,00,000",
      pricingUnit: "per Minute",
      timeline: "3-6 weeks (aprx)",
      popular: false,
      deliverables: ["3D Models", "Animation Files", "Rendered Videos", "Source Files", "Textures", "Project Files"]
    },
    {
      id: 4,
      icon: Video,
      title: "Video Production",
      category: "video",
      description: "Professional video production that tells your story and engages your audience effectively. Complete video solutions from concept to delivery.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Script Writing", "HD Video", "Editing", "Sound Design", "Color Grading", "Motion Graphics"],
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹15,000",
      pricingUnit: "per Hour",
      timeline: "2-4 weeks (aprx)",
      popular: false,
      deliverables: ["Final Video", "Raw Footage", "Audio Files", "Graphics Package", "Project Files", "Multiple Formats"]
    },
    {
      id: 5,
      icon: Smartphone,
      title: "UI/UX Design",
      category: "design",
      description: "Intuitive interfaces designed with user-centered principles for maximum engagement. Complete app and web interface solutions.",
      gradient: "from-accent/20 to-accent/10",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Handoff Files"],
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹50,000",
      pricingUnit: "per Screen",
      timeline: "2-3 weeks (aprx)",
      popular: true,
      deliverables: ["Design Files", "Prototypes", "Design System", "User Flow", "Specifications", "Assets"]
    },
    {
      id: 6,
      icon: Sparkles,
      title: "Digital Strategy",
      category: "marketing",
      description: "Data-driven strategies that align with your business goals and drive measurable results. Complete digital transformation roadmap.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Market Analysis", "Content Strategy", "Social Media", "Performance Tracking", "SEO Strategy", "Competitor Analysis"],
      startingPrice: 10000,
      priceRange: "₹10,000 - ₹2,00,000",
      pricingUnit: "per Month",
      timeline: "1-2 weeks (aprx)",
      popular: false,
      deliverables: ["Strategy Document", "Action Plan", "KPI Dashboard", "Content Calendar", "Analysis Report", "Recommendations"]
    },
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'web', name: 'Web Development', count: services.filter(s => s.category === 'web').length },
    { id: 'design', name: 'Design', count: services.filter(s => s.category === 'design').length },
    { id: 'video', name: 'Video & Animation', count: services.filter(s => s.category === 'video').length },
    { id: 'marketing', name: 'Marketing', count: services.filter(s => s.category === 'marketing').length },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

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
      <section className="relative py-20 md:py-32 overflow-hidden">
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
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(244, 197, 66, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.3)'
            }}>
              Starting our journey with innovative creative solutions. As a newly launched studio, 
              we're excited to collaborate with you and bring fresh perspectives to your projects.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-[#D4AF37]">Growing Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-[#D4AF37]">Quality Focused</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-[#D4AF37]">Timely Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border bg-secondary/30 dark:bg-background shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-accent shadow-gold" 
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden">

        {/* Content */}
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleOrderService(service.title)}
                  className="group relative text-left transition-all duration-300 rounded-lg overflow-hidden cursor-pointer"
                >
                  <Card className="relative bg-card border-border hover:border-border transition-all duration-300 hover:shadow-gold overflow-hidden h-full before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent/0 before:via-accent/20 before:to-accent/0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none">
                    {service.popular && (
                      <div className="absolute -top-0 -right-0 z-10">
                        <div className="bg-accent px-8 py-1.5 shadow-lg transform rotate-45 translate-x-7 translate-y-4 flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1 text-white dark:text-black" />
                          <span className="text-xs font-bold text-white dark:text-black">Popular</span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-accent/30`}>
                        <IconComponent className="w-8 h-8 text-accent" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground dark:text-white mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-foreground dark:text-white line-clamp-3">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="space-y-4 border-b border-border/50 pb-4">
                          <div className="flex justify-between items-baseline gap-4">
                            <span className="text-sm font-medium text-foreground/70 dark:text-white/70">Pricing</span>
                            <div className="text-right">
                              {service.title === 'Digital Strategy' && service.pricingUnit ? (
                                <div className="flex items-baseline gap-1.5 justify-end">
                                  <span className="text-2xl md:text-3xl font-bold text-accent leading-tight">{service.priceRange}</span>
                                  <span className="text-xs md:text-sm text-foreground/60 dark:text-white/60 font-medium">{service.pricingUnit}</span>
                                </div>
                              ) : (
                                <>
                                  <div className="text-2xl md:text-3xl font-bold text-accent leading-tight">{service.priceRange}</div>
                                  {service.pricingUnit && (
                                    <div className="text-xs md:text-sm text-foreground/60 dark:text-white/60 mt-1.5 font-medium">{service.pricingUnit}</div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground/70 dark:text-white/70">Timeline</span>
                            <span className="text-sm font-semibold text-foreground dark:text-white">{service.timeline}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-6">
                          <h4 className="font-semibold text-foreground dark:text-white">Key Features:</h4>
                          <div className="grid grid-cols-2 gap-1">
                            {service.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="text-xs text-foreground dark:text-white flex items-center">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <h4 className="font-semibold text-foreground dark:text-white">Deliverables:</h4>
                          <div className="text-xs text-foreground dark:text-white">
                            {service.deliverables.slice(0, 3).join(', ')} + more
                          </div>
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
      <section className="py-12 md:py-16 lg:py-24 bg-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">
              Ready to Start Your Project?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
              Join over 630+ satisfied clients who trust us with their creative projects.
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
                className="bg-accent hover:bg-accent/90 font-semibold px-4 md:px-8 py-2 md:py-3 shadow-gold text-xs md:text-sm h-8 md:h-10"
              >
                Get Free Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/#portfolio')}
                className="bg-transparent border-border text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent px-8 py-3 text-xs md:text-sm py-2 md:py-3 px-4 md:px-8 h-8 md:h-10"
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

export default AllServicesPage;





