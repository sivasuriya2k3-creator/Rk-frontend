import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Box, Video, Smartphone, Sparkles, ArrowRight, Star, Users, Clock, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      startingPrice: 207500,
      timeline: "2-4 weeks",
      clientsServed: 150,
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
      startingPrice: 124500,
      timeline: "1-2 weeks",
      clientsServed: 200,
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
      startingPrice: 249000,
      timeline: "3-6 weeks",
      clientsServed: 85,
      popular: false,
      deliverables: ["3D Models", "Animation Files", "Rendered Videos", "Source Files", "Textures", "Project Files"]
    },
    {
      id: 4,
      icon: Video,
      title: "Video Production",
      category: "video",
      description: "Professional video content that tells your story and engages your audience effectively. Complete video solutions from concept to delivery.",
      gradient: "from-accent/20 to-accent/10",
      features: ["Script Writing", "HD Video", "Editing", "Sound Design", "Color Grading", "Motion Graphics"],
      startingPrice: 166000,
      timeline: "2-4 weeks",
      clientsServed: 120,
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
      startingPrice: 149400,
      timeline: "2-3 weeks",
      clientsServed: 180,
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
      startingPrice: 99600,
      timeline: "1-2 weeks",
      clientsServed: 95,
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
      navigate('/login');
      return;
    }
    navigate(`/services/order/${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Starting our journey with innovative creative solutions. As a newly launched studio, 
              we're excited to collaborate with you and bring fresh perspectives to your projects.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="flex items-center space-x-2 text-accent">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Growing Community</span>
              </div>
              <div className="flex items-center space-x-2 text-accent">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Quality Focused</span>
              </div>
              <div className="flex items-center space-x-2 text-accent">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Timely Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-accent text-black shadow-gold" 
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="group relative bg-card border-border hover:border-border transition-all duration-300 hover:shadow-gold overflow-hidden">
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
                    <CardDescription className="text-muted-foreground line-clamp-3">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Starting at</span>
                        <span className="text-2xl font-bold text-accent">₹{service.startingPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Timeline</span>
                        <span className="text-foreground font-medium">{service.timeline}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Clients Served</span>
                        <span className="text-accent font-medium">{service.clientsServed}+</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Deliverables:</h4>
                      <div className="text-xs text-muted-foreground">
                        {service.deliverables.slice(0, 3).join(', ')} + more
                      </div>
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
              Join over 630+ satisfied clients who trust us with their creative projects.
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
                className="bg-transparent border-border text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent px-8 py-3"
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





