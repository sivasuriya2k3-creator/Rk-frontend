import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content: "RajKayal Digital Studio transformed our brand identity completely. Their attention to detail and creative vision exceeded all expectations. The team's professionalism and dedication are truly remarkable.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder, Creative Labs",
      content: "Working with RajKayal was an absolute pleasure. They delivered a stunning website that perfectly captures our brand essence. The results speak for themselves - our engagement has tripled!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director, Luxe Brands",
      content: "The 3D animations and video content they produced were beyond phenomenal. RajKayal's team brought our vision to life in ways we never imagined possible. Highly recommended!",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-words">
              Don't just take our word for it - hear what our clients have to say.
            </p>
          </div>

          {/* Testimonial Card */}
          <Card className="border-border hover:border-accent/50 transition-all duration-300 shadow-elevated">
            <CardContent className="p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote className="w-24 h-24 text-accent" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 relative z-10 break-words">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author Info */}
              <div className="space-y-1">
                <div className="font-bold text-lg text-foreground break-words">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-muted-foreground break-words">
                  {testimonials[currentIndex].role}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full bg-transparent border-accent/50 text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-accent w-8"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full bg-transparent border-accent/50 text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
