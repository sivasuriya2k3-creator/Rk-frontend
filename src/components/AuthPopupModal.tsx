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

  // Close if user is already logged in
  useEffect(() => {
    if (isUserLoggedIn()) {
      onClose();
    }
  }, [onClose]);

  const handleLogin = useCallback(() => {
    onClose();
    navigate('/login');
  }, [navigate, onClose]);

  const handleRegister = useCallback(() => {
    onClose();
    navigate('/register');
  }, [navigate, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
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
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full border border-border/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent via-accent/90 to-primary/20 text-accent-foreground p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="font-bold text-xl">Sign In Required</h2>
            <p className="text-xs text-accent-foreground/70 mt-1">Access exclusive features</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            {message}
          </p>

          {/* Features List */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border/30">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Sign in to:</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                <span>Access personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                <span>Place service orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                <span>Track your projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                <span>Get exclusive offers</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              🔐 Sign In
            </button>
            <button
              onClick={handleRegister}
              className="w-full px-4 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg border border-border/50 active:scale-95 flex items-center justify-center gap-2"
            >
              ✨ Create Account
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-muted-foreground text-center pt-2">
            You can browse freely. Login needed for orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPopupModal;
