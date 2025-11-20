import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Clear authentication when visiting login page
  useEffect(() => {
    logout();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      await login(formData.email, formData.password);
      
      // If login succeeds, navigate to home
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Check if the error indicates OTP is required
      if (err.response?.data?.requiresOTP) {
        // Redirect to OTP verification page with email
        navigate('/verify-otp', { 
          state: { email: formData.email },
          replace: true 
        });
      } else {
        // Better error messages
        let errorMessage = 'Login failed';
        
        if (err.message === 'Network Error') {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Login failed:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.05),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card className="border-border bg-background/95 backdrop-blur-xl shadow-2xl hover:shadow-gold transition-all duration-500">
            <CardHeader className="text-center space-y-4 pb-8 pt-10">
              {/* Logo */}
              <div className="flex justify-center animate-scale-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse-slow" />
                  <img 
                    src="/rajkayal-hd.png" 
                    alt="RajKayal Logo" 
                    className="h-40 w-40 relative z-10 drop-shadow-[0_0_25px_rgba(212,175,55,0.6)] object-contain"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                </div>
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">
                  Welcome <span className="gradient-text">Back</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your credentials to access your account
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      className="pl-4 pr-4 h-12 bg-background border-border focus:border-accent transition-all duration-300 hover:border-accent/50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-accent" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="pl-4 pr-4 h-12 bg-background border-border focus:border-accent transition-all duration-300 hover:border-accent/50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-black font-semibold shadow-gold group relative overflow-hidden transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {!isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    New to RajKayal?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  to="/register"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors group"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Create an Account
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
