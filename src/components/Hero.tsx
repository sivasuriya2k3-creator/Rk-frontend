import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import LiquidEther from "@/components/LiquidEther";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />

      {/* Liquid Ether Interactive Background */}
      <div className="absolute inset-0 z-[1] pointer-events-auto">
        <LiquidEther
          colors={['#FFD700', '#F4D03F', '#F9E79F', '#F7DC6F', '#F4C542']}
          mouseForce={22}
          cursorSize={110}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.55}
          autoIntensity={2.3}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 z-20 relative">{/* NOTE: pointer-events-none will stop auto-resume of LiquidEther */}
        <div className="max-w-5xl mx-auto text-center space-y-3 animate-fade-in-up flex flex-col items-center justify-center">
          {/* RK Badge Featured */}
          {/* Featured Badge */}
          <div className="flex justify-center items-center animate-fade-in w-full px-4">
            <div className="relative flex items-center justify-center">
              <img 
                src="/rajkayal-hd.png" 
                alt="RajKayal Premium Badge" 
                className="h-56 w-56 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem] object-contain mx-auto"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center whitespace-nowrap" style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent"> RajKayal</span>
              {" "}
              <span className="gradient-text">Creative Hub</span>
            </h1>
          </div>

          {/* Subheading */}
          <div className="w-full px-4">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              Where creativity meets technology. We craft exceptional digital
              experiences that inspire and transform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
            <Button
              size="lg"
              className="bg-accent text-black hover:bg-accent/90 shadow-gold group min-w-[200px]"
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

