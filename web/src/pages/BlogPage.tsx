import { useState } from "react";
import { Calendar, Clock, ArrowRight, Search, Tag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Design: Trends to Watch in 2024",
      excerpt: "Explore the latest web design trends that are shaping the digital landscape and learn how to implement them in your projects.",
      category: "Web Design",
      author: "RajKayal Team",
      date: "2024-11-15",
      readTime: "5 min read",
      image: "/blog/The Future of Web Design Trends to Watch in 2024.png",
      tags: ["Design", "Trends", "Web Development"]
    },
    {
      id: 2,
      title: "Creating Stunning 3D Animations: A Beginner's Guide",
      excerpt: "Dive into the world of 3D animation with our comprehensive guide covering essential tools, techniques, and best practices.",
      category: "3D Animation",
      author: "RajKayal Team",
      date: "2024-11-10",
      readTime: "8 min read",
      image: "/blog/Creating Stunning 3D Animations A Beginner's.png",
      tags: ["3D", "Animation", "Tutorial"]
    },
    {
      id: 3,
      title: "Building a Strong Brand Identity: Essential Steps",
      excerpt: "Learn how to create a memorable brand identity that resonates with your target audience and stands out in the market.",
      category: "Branding",
      author: "RajKayal Team",
      date: "2024-11-05",
      readTime: "6 min read",
      image: "/blog/Building a Strong Brand Identity Essential Steps.png",
      tags: ["Branding", "Identity", "Marketing"]
    },
    {
      id: 4,
      title: "UI/UX Best Practices for Mobile Applications",
      excerpt: "Discover the key principles of mobile UI/UX design that will help you create intuitive and engaging user experiences.",
      category: "UI/UX",
      author: "RajKayal Team",
      date: "2024-10-28",
      readTime: "7 min read",
      image: "/blog/UIUX Best Practices for Mobile Applications.png",
      tags: ["UI/UX", "Mobile", "Design"]
    },
    {
      id: 5,
      title: "The Power of Visual Storytelling in Digital Marketing",
      excerpt: "Learn how to leverage visual storytelling to create compelling narratives that engage your audience and drive results.",
      category: "Marketing",
      author: "RajKayal Team",
      date: "2024-10-20",
      readTime: "5 min read",
      image: "/blog/The Power of Visual Storytelling in Digital.png",
      tags: ["Marketing", "Storytelling", "Content"]
    },
    {
      id: 6,
      title: "Responsive Design: Making Your Website Work Everywhere",
      excerpt: "Master the art of responsive web design and ensure your website delivers a seamless experience across all devices.",
      category: "Web Design",
      author: "RajKayal Team",
      date: "2024-10-15",
      readTime: "6 min read",
      image: "/blog/Responsive Design Making Your Website Work.png",
      tags: ["Responsive", "Web Design", "Development"]
    }
  ];

  const categories = ["all", "Web Design", "3D Animation", "Branding", "UI/UX", "Marketing"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds gradientColors={['#C6A345', '#8B7520', '#D4AF6A']} />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 lg:pt-32 pb-12 md:pb-16 px-4 bg-gradient-to-b from-secondary/30 to-background relative z-10">
        <div className="container mx-auto max-w-6xl">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-6 md:mb-8 gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-center">
            <Badge className="mb-3 md:mb-4 bg-accent shadow-gold text-xs md:text-sm py-1 md:py-1.5">
              Insights & Resources
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 break-words">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto break-words">
              Stay updated with the latest insights, trends, and best practices in digital design and development.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 md:py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:border-accent text-xs md:text-sm h-8 md:h-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${selectedCategory === category 
                    ? "bg-accent hover:bg-accent/90" 
                    : "border-border hover:border-accent hover:text-accent"} text-xs md:text-sm py-1 md:py-2 px-2 md:px-3 h-8 md:h-10`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold cursor-pointer"
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent shadow-gold">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors break-words line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground line-clamp-3 break-words">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs text-accent">
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>

                      {/* Read More */}
                      <Button
                        variant="ghost"
                        className="w-full group/btn text-accent hover:text-accent hover:bg-accent/10"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 break-words">
            Want to Stay <span className="gradient-text">Updated</span>?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 break-words">
            Subscribe to our newsletter for the latest insights and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background border-border focus:border-accent text-xs md:text-sm h-8 md:h-10"
            />
            <Button className="bg-accent hover:bg-accent/90 shadow-gold text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
