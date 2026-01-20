/**
 * Chatbot Authentication Handler
 * 
 * Adds authentication checks to your existing chatbot
 * Shows "Please sign in" message if user is not logged in
 */

import { isUserLoggedIn } from '@/lib/authUtils';

/**
 * Check if chatbot should be enabled for current user
 * @returns {boolean} true if user can use chatbot, false otherwise
 */
export function isChatbotEnabled() {
  return isUserLoggedIn();
}

/**
 * Get the initial chatbot message based on login status
 * @returns {string} Welcome message
 */
export function getChatbotWelcomeMessage() {
  return 'Hi 👋 Welcome!';
}

/**
 * Handle chatbot message before sending
 * 
 * If user is NOT logged in:
 * - Show "Please sign in first to continue chatting."
 * - Return false to prevent message send
 * 
 * If user IS logged in:
 * - Return true to allow message send
 * 
 * USAGE in your ChatBot component:
 * 
 * const handleSendMessage = async (message) => {
 *   if (!shouldAllowChatMessage()) {
 *     // Show signin message
 *     addBotMessage('Please sign in first to continue chatting.');
 *     return false;
 *   }
 *   // Process message normally
 *   await sendMessage(message);
 * };
 */
export function shouldAllowChatMessage() {
  return isUserLoggedIn();
}

/**
 * Get disabled state for chatbot input
 * Returns true if chatbot input should be disabled
 */
export function isChatbotInputDisabled() {
  return !isUserLoggedIn();
}

/**
 * Get placeholder text for chatbot input based on login status
 */
export function getChatbotInputPlaceholder() {
  if (isUserLoggedIn()) {
    return 'Type your message...';
  }
  return 'Sign in required to chat';
}

/**
 * Handle chatbot response
 * 
 * For unauthenticated users, intercept and show login message
 * For authenticated users, proceed normally
 */
export function handleChatbotResponse(userMessage, originalHandler) {
  // If not logged in
  if (!isUserLoggedIn()) {
    return {
      isAllowed: false,
      message: 'Please sign in first to continue chatting.',
      shouldShowSignInMessage: true
    };
  }

  // If logged in, allow the response
  return {
    isAllowed: true,
    handler: originalHandler
  };
}

export default {
  isChatbotEnabled,
  getChatbotWelcomeMessage,
  shouldAllowChatMessage,
  isChatbotInputDisabled,
  getChatbotInputPlaceholder,
  handleChatbotResponse
};
