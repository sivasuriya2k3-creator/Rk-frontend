import { Target, Users, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every pixel matters. We deliver excellence in every detail.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Your vision, our expertise. We work together to achieve greatness.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge technology and creative solutions.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              <span className="gradient-text">About</span> Our Studio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-words">
              A fresh creative studio bringing innovative ideas and modern digital solutions to life.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground break-words">
                Starting Our Journey in Digital Excellence
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed break-words">
                RajKayal Digital Studio is a newly launched creative venture driven by passion, 
                innovation, and a commitment to excellence. We're building our foundation on 
                cutting-edge design principles and modern development practices to create 
                experiences that truly connect with audiences.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed break-words">
                Though we're just starting out, our team brings fresh perspectives and expertise 
                in design, development, animation, and digital strategy. We're eager to collaborate 
                with clients who value creativity and want to grow together with us.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-accent/20 overflow-hidden">
                {/* Video Background */}
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  preload="auto"
                  onError={(e) => console.error('Video error:', e)}
                  onLoadedData={() => console.log('Video loaded successfully')}
                >
                  <source src="/rajka.mp4" type="video/mp4" />
                  <source src="/rajka.mp4" type="video/webm" />
                </video>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground break-words">
                  {value.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed break-words">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
