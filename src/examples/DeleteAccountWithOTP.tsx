// Example: Verify User Before Critical Action
// File: src/components/DeleteAccountWithOTP.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { OTPVerificationModal } from '@/components/OTPVerificationModal';

const API_URL = import.meta.env.VITE_API_URL || 'https://rk-backend.vercel.app';

interface DeleteAccountWithOTPProps {
  userEmail: string;
  onAccountDeleted?: () => void;
}

export function DeleteAccountWithOTP({ userEmail, onAccountDeleted }: DeleteAccountWithOTPProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteRequest = async () => {
    setLoading(true);

    try {
      // Send OTP for verification
      await axios.post(`${API_URL}/otp/send`, {
        email: userEmail,
        purpose: 'verification'
      });

      setShowConfirm(false);
      setShowOTPModal(true);
    } catch (err) {
      alert('Failed to send verification OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    try {
      // Proceed with account deletion
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Account deleted successfully');
      localStorage.clear();
      
      if (onAccountDeleted) {
        onAccountDeleted();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
      >
        Delete Account
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Account?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. We'll send a verification code to your email to confirm.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={userEmail}
        onSuccess={handleOTPVerified}
        purpose="verification"
        autoSendOTP={false} // Already sent
      />
    </>
  );
}

export default DeleteAccountWithOTP;
