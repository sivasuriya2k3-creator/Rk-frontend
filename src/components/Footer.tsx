import { Instagram, Linkedin, Twitter, Github, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    Services: [
      { name: "Web Design", href: "#services" },
      { name: "Branding", href: "#services" },
      { name: "3D Animation", href: "#services" },
      { name: "UI/UX Design", href: "#services" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Portfolio", href: "#portfolio" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Contact", href: "#contact" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // If it's a placeholder link, do nothing
    if (href === "#") {
      return;
    }

    // If it's a route path (starts with /)
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // If it's a hash link
    if (href.startsWith("#")) {
      // If we're on the home page, just scroll to the section
      if (window.location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we're on another page, navigate to home with the hash
        navigate('/' + href);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#" || !href.startsWith("http")) {
      e.preventDefault();
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <a href="#home" onClick={handleLogoClick} className="flex items-center space-x-3 group cursor-pointer">
              <img 
                src="/rajkayal-footer.png" 
                alt="RajKayal Logo" 
                className="h-10 w-10 transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.25)]"
              />
              <span className="font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent">
                RajKayal Creative Hub 
              </span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium Creative Hub - Crafting exceptional digital experiences since 2024.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={(e) => handleSocialClick(e, social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-accent/20 flex items-center justify-center transition-all duration-300 group border border-border hover:border-accent/50"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors inline-block relative group cursor-pointer"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} RajKayal Digital Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
