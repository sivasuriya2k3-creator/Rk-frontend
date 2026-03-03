import { useState } from "react";
import { TrendingUp, Award, Users, Target, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CaseStudiesPage = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const caseStudies = [
    {
      id: 1,
      title: "E-Commerce Platform Redesign",
      client: "TechRetail Co.",
      industry: "E-Commerce",
      challenge: "Outdated design leading to high bounce rates and low conversion",
      solution: "Complete UI/UX overhaul with modern design principles and optimized user flows",
      results: [
        { metric: "Conversion Rate", value: "+145%", icon: TrendingUp },
        { metric: "User Engagement", value: "+89%", icon: Users },
        { metric: "Customer Satisfaction", value: "4.8/5", icon: Award }
      ],
      image: "/case-studies/E-Commerce Platform Redesign.png",
      tags: ["Web Design", "UX/UI", "E-Commerce"],
      testimonial: "RajKayal transformed our online presence completely. The results exceeded our expectations!",
      color: "from-accent/20"
    },
    {
      id: 2,
      title: "Luxury Brand Identity Creation",
      client: "Elite Fashion House",
      industry: "Fashion",
      challenge: "New brand needed a sophisticated identity to compete in luxury market",
      solution: "Developed comprehensive brand strategy including logo, color palette, and marketing materials",
      results: [
        { metric: "Brand Recognition", value: "+210%", icon: Target },
        { metric: "Social Engagement", value: "+175%", icon: Users },
        { metric: "Market Position", value: "Top 10", icon: Award }
      ],
      image: "/case-studies/Luxury Brand Identity Creation.png",
      tags: ["Branding", "Identity", "Luxury"],
      testimonial: "The branding work was exceptional. We now have a distinct identity that resonates with our audience.",
      color: "from-accent/20"
    },
    {
      id: 3,
      title: "3D Product Visualization Platform",
      client: "FurniTech Solutions",
      industry: "Furniture",
      challenge: "Customers couldn't visualize products in their space before purchase",
      solution: "Created interactive 3D models with AR capabilities for realistic product visualization",
      results: [
        { metric: "Sales Increase", value: "+195%", icon: TrendingUp },
        { metric: "Return Rate", value: "-67%", icon: Target },
        { metric: "User Satisfaction", value: "4.9/5", icon: Award }
      ],
      image: "/case-studies/3D Product Visualization Platform.png",
      tags: ["3D Animation", "AR/VR", "Technology"],
      testimonial: "The 3D visualization tool changed how our customers shop. Absolutely game-changing!",
      color: "from-accent/20"
    },
    {
      id: 4,
      title: "Mobile Banking App Design",
      client: "SecureBank Digital",
      industry: "Finance",
      challenge: "Complex banking features causing user confusion and app abandonment",
      solution: "Simplified interface with intuitive navigation and enhanced security features",
      results: [
        { metric: "Active Users", value: "+230%", icon: Users },
        { metric: "App Rating", value: "4.7/5", icon: Award },
        { metric: "Transaction Speed", value: "+85%", icon: TrendingUp }
      ],
      image: "/case-studies/Mobile Banking App Design.png",
      tags: ["UI/UX", "Mobile", "FinTech"],
      testimonial: "Our customers love the new app. It's intuitive, fast, and secure.",
      color: "from-accent/20"
    },
    {
      id: 5,
      title: "Corporate Video Production",
      client: "InnovateCorp",
      industry: "Technology",
      challenge: "Needed compelling video content to explain complex B2B solutions",
      solution: "Produced series of animated explainer videos and product demonstrations",
      results: [
        { metric: "Lead Generation", value: "+156%", icon: Target },
        { metric: "Video Completion", value: "92%", icon: Users },
        { metric: "Sales Pipeline", value: "+178%", icon: TrendingUp }
      ],
      image: "/case-studies/Corporate Video Production.png",
      tags: ["Video Production", "Animation", "B2B"],
      testimonial: "The videos simplified our messaging and dramatically improved our sales conversations.",
      color: "from-accent/20"
    },
    {
      id: 6,
      title: "Restaurant Chain Digital Transformation",
      client: "Gourmet Eats Group",
      industry: "Food & Beverage",
      challenge: "Needed unified digital presence across 50+ locations",
      solution: "Created cohesive brand system with web platform, mobile app, and digital menu boards",
      results: [
        { metric: "Online Orders", value: "+285%", icon: TrendingUp },
        { metric: "Customer Loyalty", value: "+165%", icon: Users },
        { metric: "Average Order", value: "+42%", icon: Award }
      ],
      image: "/case-studies/Restaurant Chain Digital Transformation.png",
      tags: ["Digital Strategy", "Mobile", "Web"],
      testimonial: "RajKayal unified our brand across all touchpoints. Exceptional work!",
      color: "from-accent/20"
    }
  ];

  const industries = ["all", "E-Commerce", "Fashion", "Furniture", "Finance", "Technology", "Food & Beverage"];

  const filteredCaseStudies = selectedIndustry === "all" 
    ? caseStudies 
    : caseStudies.filter(cs => cs.industry === selectedIndustry);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds gradientColors={['#C6A345', '#8B7520', '#D4AF6A']} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-secondary/30 to-background relative z-10">
        <div className="container mx-auto max-w-6xl">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <Badge className="mb-4 bg-accent shadow-gold">
              Success Stories
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 break-words">
              Case <span className="gradient-text">Studies</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-words">
              Discover how we've helped businesses transform their digital presence and achieve remarkable results.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "default" : "outline"}
                onClick={() => setSelectedIndustry(industry)}
                className={selectedIndustry === industry 
                  ? "bg-accent hover:bg-accent/90" 
                  : "border-border hover:border-accent hover:text-accent"}
              >
                {industry.charAt(0).toUpperCase() + industry.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-16">
          {filteredCaseStudies.map((study, index) => (
            <Card
              key={study.id}
              className="overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold"
            >
              <CardContent className="p-0">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden aspect-[4/3] ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${study.color} to-transparent`} />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 space-y-6">
                    {/* Header */}
                    <div>
                      <Badge className="mb-3 bg-accent shadow-gold">
                        {study.industry}
                      </Badge>
                      <h2 className="text-3xl font-bold mb-2 break-words">{study.title}</h2>
                      <p className="text-muted-foreground break-words">Client: {study.client}</p>
                    </div>

                    {/* Challenge */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Challenge</h3>
                      <p className="text-muted-foreground break-words">{study.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Solution</h3>
                      <p className="text-muted-foreground break-words">{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Results</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {study.results.map((result, idx) => (
                          <div key={idx} className="text-center p-4 rounded-lg bg-secondary/30 border border-border">
                            <result.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                            <div className="text-2xl font-bold text-accent mb-1">{result.value}</div>
                            <div className="text-xs text-muted-foreground break-words">{result.metric}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="border-accent/30 text-accent">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="p-4 rounded-lg bg-accent/5 border-l-4 border-accent">
                      <p className="text-foreground italic break-words">"{study.testimonial}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 break-words">
            Ready to Create Your <span className="gradient-text">Success Story</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 break-words">
            Let's discuss how we can help you achieve similar results for your business.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 shadow-gold group">
            <a href="#contact">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
