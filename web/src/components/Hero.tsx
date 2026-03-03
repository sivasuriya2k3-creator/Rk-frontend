import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense, Component, ReactNode, ErrorInfo } from "react";
import LiquidEther from "./LiquidEther";

// Error fallback component
const LiquidEtherFallback = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-amber-900/10 to-black" />
);

// Simple Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LiquidEther error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <LiquidEtherFallback />;
    }

    return this.props.children;
  }
}

// Error boundary wrapper
const ErrorBoundaryWrapper = ({ 
  children, 
  onError 
}: { 
  children: ReactNode; 
  onError?: (error: Error) => void;
}) => (
  <ErrorBoundary onError={onError}>
    {children}
  </ErrorBoundary>
);

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* LiquidEther Background with Error Boundary */}
      <ErrorBoundaryWrapper>
        <Suspense fallback={<LiquidEtherFallback />}>
          <div className="absolute inset-0 z-0">
            <LiquidEther 
              colors={['#FFD700', '#FFC700', '#FFE135']}
              autoIntensity={1.8}
              autoSpeed={0.4}
            />
          </div>
        </Suspense>
      </ErrorBoundaryWrapper>

      {/* Fallback gradient if LiquidEther fails */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-amber-900/10 to-black opacity-0 hover:opacity-100 transition-opacity" />

      {/* Background Overlay - Semi-transparent for content readability */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none" />

      {/* Smooth fade to background at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-32 z-2 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      {/* Floating Particles Effect - Static twinkling background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        {[...Array(isMobile ? 4 : 10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-accent rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 z-20 relative">
        <div className="max-w-5xl mx-auto text-center space-y-3 animate-fade-in-up flex flex-col items-center justify-center">
          {/* RK Badge Featured */}
          <div className="flex justify-center items-center animate-fade-in w-full px-4">
            <div className="relative flex items-center justify-center">
              <img src="/rklogofinal.png" alt="RajKayal Logo" className="h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] hover:drop-shadow-[0_0_30px_rgba(255,215,0,1)] transition-all duration-300" style={{ willChange: 'filter' }} />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm mx-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-accent">
              Premium Creative Hub Since 2024
            </span>
          </div>

          {/* Main Heading */}
          <div className="w-full px-4 flex justify-center items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center whitespace-nowrap" style={{ filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.5))' }}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent">RajKayal</span>
              <span className="gradient-text mx-2">Creative Hub</span>
            </h1>
          </div>

          {/* Subheading */}
          <div className="w-full px-4">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center">
              Where creativity meets technology. We craft exceptional digital
              experiences that inspire and transform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 shadow-gold group min-w-[200px]"
              asChild
            >
              <a href="#portfolio" className="flex items-center justify-center">
                Explore Our Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-accent/50 text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent min-w-[200px]"
              asChild
            >
              <a href="#contact" className="flex items-center justify-center">Get in Touch</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

