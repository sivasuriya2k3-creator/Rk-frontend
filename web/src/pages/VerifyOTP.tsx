import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '@/lib/authService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, Mail, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Get email from navigation state
  const userEmail = location.state?.email;

  useEffect(() => {
    // Redirect to login if no email is provided
    if (!userEmail) {
      navigate('/login');
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.verifyOTP({ email: userEmail, otp });
      
      if (response.token && response.user) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update auth context immediately
        setAuthUser(response.user);
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/management', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.resendOTP({ email: userEmail });
      setError('');
      setResendCooldown(60); // 60 second cooldown
      
      // Show success message
      alert(response.message || 'New OTP sent successfully! Check your email.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  if (!userEmail) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Card className="w-full max-w-md border-border mx-4">
        <CardHeader className="text-center space-y-4">
          {/* Shield Icon */}
          <div className="flex items-center justify-center gap-2">
            <div className="p-3 rounded-full bg-accent/10 border border-accent/30">
              <Shield className="w-6 h-6 text-accent" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold">
            <span className="gradient-text">Verify OTP</span>
          </CardTitle>
          
          <CardDescription className="text-base">
            Enter the 6-digit verification code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email Display */}
          <div className="flex items-center gap-3 text-sm bg-accent/5 border border-accent/20 p-4 rounded-lg">
            <div className="p-2 rounded-full bg-accent/10">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs mb-1">OTP sent to</p>
              <p className="font-medium text-foreground">{userEmail}</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* OTP Form */}
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-sm font-medium">Enter 6-Digit OTP</label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="text-xl h-14 w-12" />
                  <InputOTPSlot index={1} className="text-xl h-14 w-12" />
                  <InputOTPSlot index={2} className="text-xl h-14 w-12" />
                  <InputOTPSlot index={3} className="text-xl h-14 w-12" />
                  <InputOTPSlot index={4} className="text-xl h-14 w-12" />
                  <InputOTPSlot index={5} className="text-xl h-14 w-12" />
                </InputOTPGroup>
              </InputOTP>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Code expires in 10 minutes</span>
              </div>
            </div>

            {/* Verify Button */}
            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold shadow-lg hover:shadow-accent/50 transition-all"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify & Login'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Need help?</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Resend OTP */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendOTP}
              disabled={isLoading || resendCooldown > 0}
            >
              {resendCooldown > 0 ? (
                `Resend OTP in ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Resend OTP
                </>
              )}
            </Button>

            {/* Back to Login */}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Didn't receive the code?
            </p>
            <p className="text-xs text-muted-foreground">
              Check your spam folder or click "Resend OTP"
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
