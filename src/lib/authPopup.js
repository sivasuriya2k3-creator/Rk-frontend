/**
 * Login/Register Popup Modal
 * 
 * Creates a non-intrusive popup that suggests user to login/register.
 * Does NOT change any existing UI theme or colors.
 */

import { isUserLoggedIn } from '@/lib/authUtils';

class AuthPopup {
  constructor() {
    this.isOpen = false;
    this.autoShowTimer = null;
    this.popupElement = null;
    this.backgroundElement = null;
    this.AUTO_SHOW_INTERVAL = 10000; // 10 seconds
  }

  /**
   * Create and show the popup modal
   */
  show() {
    // Don't show if already logged in
    if (isUserLoggedIn()) {
      return;
    }

    // Don't show if already open
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.createModal();
    this.attachEventListeners();
  }

  /**
   * Close the popup modal
   */
  close() {
    if (this.popupElement) {
      this.popupElement.remove();
    }
    if (this.backgroundElement) {
      this.backgroundElement.remove();
    }
    this.isOpen = false;
  }

  /**
   * Create the modal HTML structure
   */
  createModal() {
    // Backdrop/overlay
    this.backgroundElement = document.createElement('div');
    this.backgroundElement.id = 'auth-popup-overlay';
    this.backgroundElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Modal container
    this.popupElement = document.createElement('div');
    this.popupElement.id = 'auth-popup-modal';
    this.popupElement.style.cssText = `
      position: fixed;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      max-width: 400px;
      width: 90%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: slideIn 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -48%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    `;
    document.head.appendChild(style);

    // Modal content
    this.popupElement.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <!-- Close button -->
        <button id="auth-popup-close" style="
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
          ✕
        </button>

        <!-- Title -->
        <h2 style="
          margin: 0 0 10px 0;
          font-size: 20px;
          color: #333;
          font-weight: 600;
        ">
          Sign In Required
        </h2>

        <!-- Message -->
        <p style="
          margin: 0 0 20px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        ">
          Please sign in or register to access full features and place orders.
        </p>

        <!-- Buttons container -->
        <div style="display: flex; gap: 12px; flex-direction: column;">
          <!-- Login button -->
          <button id="auth-popup-login" style="
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
          " onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007bff'">
            🔐 Sign In
          </button>

          <!-- Register button -->
          <button id="auth-popup-register" style="
            padding: 12px 24px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
          " onmouseover="this.style.backgroundColor='#1e7b34'" onmouseout="this.style.backgroundColor='#28a745'">
            ✨ Create Account
          </button>
        </div>

        <!-- Footer text -->
        <p style="
          margin: 16px 0 0 0;
          font-size: 12px;
          color: #999;
        ">
          You can browse freely. Login needed for orders.
        </p>
      </div>
    `;

    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.popupElement);
  }

  /**
   * Attach event listeners to modal buttons
   */
  attachEventListeners() {
    // Close button
    const closeBtn = document.getElementById('auth-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Overlay click to close
    if (this.backgroundElement) {
      this.backgroundElement.addEventListener('click', (e) => {
        if (e.target === this.backgroundElement) {
          this.close();
        }
      });
    }

    // Login button
    const loginBtn = document.getElementById('auth-popup-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.close();
        // Navigate to existing login page
        window.location.href = '/login';
      });
    }

    // Register button
    const registerBtn = document.getElementById('auth-popup-register');
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        this.close();
        // Navigate to existing register page
        window.location.href = '/register';
      });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Start auto-showing popup every 10 seconds
   */
  startAutoShow() {
    // Clear existing timer
    if (this.autoShowTimer) {
      clearInterval(this.autoShowTimer);
    }

    // Show immediately
    this.show();

    // Then show every 10 seconds if not logged in
    this.autoShowTimer = setInterval(() => {
      if (!isUserLoggedIn() && !this.isOpen) {
        this.show();
      }
    }, this.AUTO_SHOW_INTERVAL);
  }

  /**
   * Stop auto-showing popup
   */
  stopAutoShow() {
    if (this.autoShowTimer) {
      clearInterval(this.autoShowTimer);
      this.autoShowTimer = null;
    }
  }
}

// Create singleton instance
let authPopupInstance = null;

/**
 * Get or create the auth popup instance
 */
export function getAuthPopup() {
  if (!authPopupInstance) {
    authPopupInstance = new AuthPopup();
  }
  return authPopupInstance;
}

/**
 * Show the popup immediately
 */
export function showAuthPopup() {
  const popup = getAuthPopup();
  popup.show();
}

/**
 * Close the popup
 */
export function closeAuthPopup() {
  const popup = getAuthPopup();
  popup.close();
}

/**
 * Start auto-showing popup every 10 seconds
 */
export function startAuthPopupAutoShow() {
  const popup = getAuthPopup();
  popup.startAutoShow();
}

/**
 * Stop auto-showing popup
 */
export function stopAuthPopupAutoShow() {
  const popup = getAuthPopup();
  popup.stopAutoShow();
}

export default {
  getAuthPopup,
  showAuthPopup,
  closeAuthPopup,
  startAuthPopupAutoShow,
  stopAuthPopupAutoShow
};
