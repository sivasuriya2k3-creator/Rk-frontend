/**
 * Restricted Actions Handler
 * 
 * Wrapper function to protect actions that require login
 * Shows popup if user is not logged in
 */

import { isUserLoggedIn } from '@/lib/authUtils';

/**
 * Helper function to show auth popup via event
 */
function showAuthPopupEvent() {
  const event = new CustomEvent('showAuthPopup');
  window.dispatchEvent(event);
}

/**
 * Wrap any action that requires authentication
 * 
 * @param {Function} action - The function to execute if user is logged in
 * @param {string} message - Optional custom message to show
 * @returns {Promise} Result of the action or false if not logged in
 * 
 * USAGE EXAMPLE:
 * 
 * // For button click:
 * <button onclick="protectedAction(() => placeOrder(), 'Please sign in first to place an order.')">
 *   Place Order
 * </button>
 * 
 * // For async action:
 * const result = await protectedAction(async () => {
 *   return await checkout();
 * });
 */
export async function protectedAction(action, message = 'Please sign in first to continue.') {
  // Check if user is logged in
  if (!isUserLoggedIn()) {
    // Show popup via event
    showAuthPopupEvent();
    
    // Show message in console (optional)
    console.warn('Action blocked:', message);
    
    return false;
  }

  // User is logged in, execute the action
  try {
    if (typeof action === 'function') {
      const result = action();
      // Handle async functions
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }
  } catch (error) {
    console.error('Error executing protected action:', error);
    throw error;
  }
}

/**
 * Alternative: Decorator pattern for functions
 * Converts a function to require authentication
 * 
 * USAGE EXAMPLE:
 * const protectedPlaceOrder = requireAuth(placeOrder);
 * await protectedPlaceOrder();
 */
export function requireAuth(fn, message = 'Please sign in first to continue.') {
  return async function(...args) {
    if (!isUserLoggedIn()) {
      showAuthPopupEvent();
      console.warn('Action blocked:', message);
      return false;
    }
    return fn.apply(this, args);
  };
}

/**
 * Protect an HTML element's click action
 * 
 * USAGE EXAMPLE:
 * const orderBtn = document.getElementById('place-order-btn');
 * protectElementClick(orderBtn, () => {
 *   console.log('Placing order...');
 *   // Your logic here
 * });
 */
export function protectElementClick(element, action, message = 'Please sign in first to continue.') {
  if (!element) return;

  element.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!isUserLoggedIn()) {
      showAuthPopupEvent();
      console.warn('Action blocked:', message);
      return false;
    }

    // Execute the action
    try {
      const result = action();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('Error executing protected action:', error);
    }
  });
}

export default {
  protectedAction,
  requireAuth,
  protectElementClick
};
