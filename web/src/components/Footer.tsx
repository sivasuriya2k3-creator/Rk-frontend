import { Instagram, Linkedin, Github, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// X Logo SVG Component
const XLogo = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L0 2.25h6.554l4.702 6.162L17.464 2.25h.78zm-1.097 17.537h1.828L5.863 4.14H3.914l13.233 15.647z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    Services: [
      { name: "Web Development", href: "/web-development" },
      { name: "Branding & Identity", href: "/branding-identity" },
      { name: "UI/UX Design", href: "/uiux-design" },
      { name: "3D Animation", href: "/3d-animation" },
    ],
    Resources: [
      { name: "Portfolio", href: "/case-studies" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Apply for Job", href: "/apply-employee" },
    ],
    Company: [
      { name: "About Us", href: "/" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/rajkayal_design", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/sivasuriyan-raja-86b044312", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/SivasuriyanRaja", label: "GitHub" },
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

  const handleLogoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#" || !href.startsWith("http")) {
      e.preventDefault();
    }
  };

  return (
    <footer className="w-full bg-black/80 dark:bg-black border-t border-gold/20 mt-12 sm:mt-16 md:mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        {/* Top Section - Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer" onClick={handleLogoClick}>
              <img src="/rklogofinal.png" alt="RajKayal Logo" className="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 drop-shadow-[0_0_10px_rgba(253,185,19,0.4)] transition-all duration-300" />
              <span className="font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#FDB913] to-[#D4A520] bg-clip-text text-transparent">
                RajKayal Creative Hub
              </span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xs">
              Premium Crafting exceptional digital experiences and innovative solutions since 2024.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={(e) => handleSocialClick(e, social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/10 hover:bg-gold/25 flex items-center justify-center transition-all duration-300 border border-gold/30 hover:border-gold/60 group"
                >
                  <social.icon className="w-5 h-5 sm:w-5 sm:h-5 text-gold group-hover:text-gold transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-bold text-gold text-sm sm:text-base">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-xs sm:text-sm text-gray-300 hover:text-gold transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-gold/50 rounded-full mr-2 group-hover:bg-gold transition-colors" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-6 sm:my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © {currentYear} RajKayal Digital Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
