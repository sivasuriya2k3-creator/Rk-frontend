import { Palette, Code, Box, Video, Smartphone, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: Code,
      title: "Web Design & Development",
      description: "Custom websites built with modern technologies, optimized for performance and user experience.",
      gradient: "from-accent/20 to-accent/10",
    },
    {
      icon: Palette,
      title: "Branding & Identity",
      description: "Comprehensive brand strategies that capture your essence and resonate with your audience.",
      gradient: "from-accent/20 to-accent/10",
    },
    {
      icon: Box,
      title: "3D Animation",
      description: "Stunning 3D visuals and animations that bring your concepts to life with cinematic quality.",
      gradient: "from-accent/20 to-accent/10",
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Professional video content that tells your story and engages your audience effectively.",
      gradient: "from-accent/20 to-accent/10",
    },
    {
      icon: Smartphone,
      title: "UI/UX Design",
      description: "Intuitive interfaces designed with user-centered principles for maximum engagement.",
      gradient: "from-accent/20 to-accent/10",
    },
    {
      icon: Sparkles,
      title: "Digital Strategy",
      description: "Data-driven strategies that align with your business goals and drive measurable results.",
      gradient: "from-accent/20 to-accent/10",
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-words">
              Comprehensive digital solutions tailored to elevate your brand and achieve your goals.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 relative">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors group-hover:scale-110 duration-300">
                      <service.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground break-words">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed break-words">
                      {service.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Let's Order Now Button */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/services')}
              className="bg-accent hover:bg-accent/90 font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 shadow-gold hover:shadow-lg group"
            >
              Let's Order Now!
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
