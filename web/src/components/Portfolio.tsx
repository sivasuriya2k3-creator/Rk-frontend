import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const Portfolio = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Web Design & Development",
      image: project1,
      description: "Modern e-commerce solution with seamless user experience",
      link: "/web-development",
    },
    {
      title: "Luxury Brand Identity",
      category: "Branding",
      image: project2,
      description: "Complete brand identity for premium lifestyle brand",
      link: "/branding-identity",
    },
    {
      title: "Abstract 3D Art",
      category: "3D Animation",
      image: project3,
      description: "Stunning 3D visuals for digital marketing campaign",
      link: "/3d-animation",
    },
    {
      title: "Mobile Banking App",
      category: "UI/UX Design",
      image: project4,
      description: "Intuitive mobile banking experience design",
      link: "/uiux-design",
    },
  ];

  return (
    <section id="portfolio" className="py-24 md:py-32 relative overflow-hidden bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-yellow-900/10 to-black z-0" />
      
      {/* Accent Light */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto break-words">
              Explore our latest work and see how we bring creative visions to life.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              project.link ? (
                <Link key={project.title} to={project.link}>
                  <Card
                    className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-500 hover:shadow-gold"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      {/* Image Container */}
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-6">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-gold">
                              <ExternalLink className="w-5 h-5 text-accent-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-6 space-y-2">
                        <div className="text-sm text-accent font-medium break-words">
                          {project.category}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors break-words">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground break-words">
                          {project.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card
                  key={project.title}
                  className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-500 hover:shadow-gold"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-gold">
                            <ExternalLink className="w-5 h-5 text-accent-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 space-y-2">
                      <div className="text-sm text-accent font-medium break-words">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors break-words">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground break-words">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;