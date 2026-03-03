import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold gradient-text break-words">404</h1>
          <p className="mb-4 text-xl text-muted-foreground break-words">Oops! Page not found</p>
          <a href="/" className="text-accent underline hover:text-accent/80 transition-colors break-words">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
