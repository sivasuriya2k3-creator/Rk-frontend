import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '@/lib/authUtils';

interface AuthPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const AuthPopupModal: React.FC<AuthPopupModalProps> = ({
  isOpen,
  onClose,
  message = "Please sign in or register to access full features and place orders.",
}) => {
  const navigate = useNavigate();

  // Check if user is logged in and close popup if they are
  useEffect(() => {
    if (isOpen && isUserLoggedIn()) {
      console.log('User already logged in, closing popup');
      onClose();
    }
  }, [isOpen, onClose]);

  // Add keyboard listener for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  const handleLogin = useCallback(() => {
    onClose();
    setTimeout(() => navigate('/login'), 100);
  }, [navigate, onClose]);

  const handleRegister = useCallback(() => {
    onClose();
    setTimeout(() => navigate('/register'), 100);
  }, [navigate, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="bg-black rounded-2xl shadow-2xl max-w-sm w-full border border-amber-500/30 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
        {/* Header - Black background with Gold gradient border */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="font-bold text-xl">Sign In Required</h2>
            <p className="text-xs text-black/70 mt-1">Access exclusive features</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-black/20 p-2 rounded-lg transition-colors text-black"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-white text-sm leading-relaxed">
            {message}
          </p>

          {/* Features List - Dark background with gold accents */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 border border-amber-500/20">
            <p className="text-xs font-semibold text-amber-400 mb-3">Sign in to:</p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Access personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Place service orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Track your projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Get exclusive offers</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 flex items-center justify-center gap-2"
            >
              🔐 Sign In
            </button>
            <button
              onClick={handleRegister}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg border border-amber-500/40 hover:border-amber-500/60 active:scale-95 flex items-center justify-center gap-2"
            >
              ✨ Create Account
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-400 text-center pt-2">
            You can browse freely. Login needed for orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPopupModal;
