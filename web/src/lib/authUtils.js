/**
 * Authentication Utilities
 * 
 * Reusable functions for checking user login status
 * and managing authentication state.
 */

/**
 * Check if user is currently logged in
 * Uses localStorage, sessionStorage, or cookies based on your setup
 * 
 * @returns {boolean} true if user is logged in, false otherwise
 */
export function isUserLoggedIn() {
  // Check localStorage (most common)
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return true;
  }
  
  // Check sessionStorage as backup
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) {
    return true;
  }
  
  // Check cookies (if using cookie-based auth)
  // Uncomment if needed:
  // const cookies = document.cookie.split(';');
  // const authCookie = cookies.some(c => c.trim().startsWith('auth_token='));
  // if (authCookie) return true;
  
  return false;
}

/**
 * Get current logged-in user info
 * @returns {Object|null} user object or null
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return null;
    }
  }
  return null;
}

/**
 * Clear user authentication (logout)
 */
export function clearAuthentication() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  // If using cookies, clear them too
}

/**
 * Set user authentication (called after successful login)
 * @param {Object} userData - user object
 * @param {string} token - JWT or session token
 */
export function setAuthentication(userData, token) {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
}

export default {
  isUserLoggedIn,
  getCurrentUser,
  clearAuthentication,
  setAuthentication
};
