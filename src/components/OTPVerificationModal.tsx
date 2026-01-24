import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { OTPInput } from './OTPInput';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: (data: any) => void;
  purpose?: 'login' | 'registration' | 'verification' | 'password-reset';
  autoSendOTP?: boolean;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onSuccess,
  purpose = 'verification',
  autoSendOTP = true
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'https://rk-backend.vercel.app';

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && autoSendOTP) {
      sendOTP();
    }
  }, [isOpen, autoSendOTP]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.post(`${API_URL}/otp/send`, {
        email,
        purpose
      });

      if (response.data.success) {
        setSuccess('OTP sent to your email');
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setResendCooldown(60); // 1 minute cooldown before next resend
        setAttemptsLeft(3); // Reset attempts
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to send OTP';
      setError(errorMsg);
      
      // If rate limited, extract wait time
      if (err.response?.status === 429 && err.response?.data?.waitSeconds) {
        setResendCooldown(err.response.data.waitSeconds);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpValue: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(`${API_URL}/otp/verify`, {
        email,
        otp: otpValue
      });

      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        setTimeout(() => {
          onSuccess(response.data);
          handleClose();
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid OTP';
      setError(errorMsg);
      
      // Update attempts left if provided
      if (err.response?.data?.attemptsLeft !== undefined) {
        setAttemptsLeft(err.response.data.attemptsLeft);
      }
      
      // Clear OTP input on error
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    await sendOTP();
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    setError(''); // Clear error when user types
  };

  const handleOTPComplete = (value: string) => {
    verifyOTP(value);
  };

  const handleClose = () => {
    setOtp('');
    setError('');
    setSuccess('');
    setTimeLeft(300);
    setAttemptsLeft(3);
    setCanResend(false);
    setResendCooldown(0);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700]">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to
          </p>
          <p className="font-semibold text-[#D4AF37] mt-1">
            {email}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <OTPInput
            value={otp}
            onChange={handleOTPChange}
            onComplete={handleOTPComplete}
            disabled={loading || timeLeft === 0}
            error={!!error}
          />
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Code expires in{' '}
              <span className="font-semibold text-[#D4AF37]">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-500 font-semibold">
              Code has expired
            </p>
          )}
        </div>

        {/* Attempts Left */}
        {attemptsLeft < 3 && (
          <div className="text-center mb-4">
            <p className="text-sm text-orange-500">
              {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              {success}
            </p>
          </div>
        )}

        {/* Resend Button */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0 || (!canResend && timeLeft > 0)}
            className={`
              text-sm font-medium transition-colors
              ${loading || resendCooldown > 0 || (!canResend && timeLeft > 0)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#D4AF37] hover:text-[#FFD700] cursor-pointer'
              }
            `}
          >
            {loading ? (
              'Sending...'
            ) : resendCooldown > 0 ? (
              `Resend OTP in ${resendCooldown}s`
            ) : (
              "Didn't receive the code? Resend OTP"
            )}
          </button>
        </div>

        {/* Verify Button (Manual) */}
        {otp.length === 6 && (
          <button
            onClick={() => verifyOTP(otp)}
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationModal;
