# Authentication System Integration Guide

## Overview

This guide explains how to integrate the authentication system into your existing website. No UI changes needed - only add logic and connect to your existing pages.

## Files Created

```
src/lib/authUtils.js         - Authentication status checking
src/lib/authPopup.js         - Login/Register popup modal
src/lib/protectedActions.js  - Access control for restricted actions
src/lib/chatbotAuth.js       - Chatbot authentication checks
```

---

## 1. Initialize Auth Popup on Page Load

### Location: Your main App.tsx or index.html's entry point

```javascript
// In your App.tsx or main.tsx (React)
import { startAuthPopupAutoShow } from '@/lib/authPopup';

export default function App() {
  useEffect(() => {
    // Start showing popup every 10 seconds if user is not logged in
    startAuthPopupAutoShow();
  }, []);

  return (
    // Your existing app components
  );
}
```

### OR in plain JavaScript (if using HTML/JS):

```html
<!-- At the end of your body tag -->
<script>
  import { startAuthPopupAutoShow } from './src/lib/authPopup.js';
  
  // Start auto-showing popup when page loads
  window.addEventListener('DOMContentLoaded', () => {
    startAuthPopupAutoShow();
  });
</script>
```

---

## 2. Protect Restricted Action Buttons

### Example 1: Place Order Button

```html
<!-- BEFORE (without protection) -->
<button onclick="placeOrder()">
  Place Order
</button>

<!-- AFTER (with protection) -->
<button onclick="handlePlaceOrder()">
  Place Order
</button>
```

```javascript
import { protectedAction } from '@/lib/protectedActions';

async function handlePlaceOrder() {
  const success = await protectedAction(
    async () => {
      // Your actual order logic
      const result = await placeOrder();
      return result;
    },
    'Please sign in first to place an order.'
  );

  if (success) {
    // Order was successful
    console.log('Order placed!');
  }
}
```

### Example 2: Book Service Button

```html
<button onclick="handleBookService()">
  Book Service
</button>
```

```javascript
import { protectedAction } from '@/lib/protectedActions';

async function handleBookService(serviceId) {
  const success = await protectedAction(
    async () => {
      return await bookService(serviceId);
    },
    'Please sign in first to book a service.'
  );

  if (success) {
    console.log('Service booked!');
  }
}
```

### Example 3: Checkout Button

```html
<button onclick="handleCheckout()">
  Proceed to Checkout
</button>
```

```javascript
import { protectedAction } from '@/lib/protectedActions';

async function handleCheckout() {
  const success = await protectedAction(
    () => {
      // Go to checkout page
      window.location.href = '/checkout';
    },
    'Please sign in first to checkout.'
  );
}
```

### Alternative: Using requireAuth Decorator

```javascript
import { requireAuth } from '@/lib/protectedActions';

// Wrap your existing functions
const protectedPlaceOrder = requireAuth(placeOrder);
const protectedBookService = requireAuth(bookService);

// Use them normally - they'll check auth automatically
async function handlePlaceOrder() {
  await protectedPlaceOrder();
}
```

---

## 3. Integrate with Existing Chatbot

### For React Components:

```jsx
// In your ChatBot.tsx component
import { isChatbotEnabled, getChatbotInputPlaceholder, shouldAllowChatMessage } from '@/lib/chatbotAuth';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    // Check if user is logged in
    if (!shouldAllowChatMessage()) {
      // Add bot message instead
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Please sign in first to continue chatting.'
      }]);
      return;
    }

    // User is logged in - proceed normally
    // Your existing chatbot logic here
    sendMessageToServer(message);
  };

  return (
    <div>
      {/* Existing chatbot UI */}
      <div id="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={isChatbotEnabled() ? false : true}
        placeholder={getChatbotInputPlaceholder()}
      />

      <button onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}
```

### For Plain JavaScript Chatbot:

```javascript
import { isChatbotEnabled, shouldAllowChatMessage, getChatbotInputPlaceholder } from '@/lib/chatbotAuth';

// Get references
const chatbotInput = document.getElementById('chatbot-input');
const sendButton = document.getElementById('send-message-btn');

// Update placeholder
chatbotInput.placeholder = getChatbotInputPlaceholder();

// Disable input if not logged in
chatbotInput.disabled = !isChatbotEnabled();

// Handle send button
sendButton.addEventListener('click', () => {
  if (!shouldAllowChatMessage()) {
    // Show bot message
    addBotMessage('Please sign in first to continue chatting.');
    return;
  }

  // Proceed with normal chatbot logic
  const userMessage = chatbotInput.value;
  sendMessageToServer(userMessage);
});
```

---

## 4. Update Existing Login/Register Pages

### After Successful Login

```javascript
// In your existing login page (after successful login)
import { setAuthentication } from '@/lib/authUtils';

async function handleLoginSuccess(userData, token) {
  // Save authentication
  setAuthentication(userData, token);

  // Redirect back to home page
  window.location.href = '/';
  // OR if using React Router:
  // navigate('/');
}
```

### After Successful Registration

```javascript
// In your existing register page (after successful registration)
import { setAuthentication } from '@/lib/authUtils';

async function handleRegistrationSuccess(userData, token) {
  // Save authentication
  setAuthentication(userData, token);

  // Redirect back to home page
  window.location.href = '/';
}
```

---

## 5. Add Logout Functionality

```javascript
import { clearAuthentication } from '@/lib/authUtils';
import { stopAuthPopupAutoShow } from '@/lib/authPopup';

function handleLogout() {
  // Clear authentication
  clearAuthentication();

  // Stop auto-showing popup
  stopAuthPopupAutoShow();

  // Redirect to home
  window.location.href = '/';
}
```

---

## Complete Integration Example

### React Component Example

```jsx
// pages/HomePage.tsx
import React, { useEffect } from 'react';
import { startAuthPopupAutoShow } from '@/lib/authPopup';
import { protectedAction } from '@/lib/protectedActions';

export default function HomePage() {
  useEffect(() => {
    // Initialize auth popup on page load
    startAuthPopupAutoShow();
  }, []);

  // Protected action handler
  const handlePlaceOrder = async () => {
    await protectedAction(
      async () => {
        // Your order logic
        const response = await fetch('/api/orders', { method: 'POST' });
        return response.json();
      },
      'Please sign in first to place an order.'
    );
  };

  const handleBookService = async (serviceId) => {
    await protectedAction(
      async () => {
        // Your booking logic
        const response = await fetch('/api/services/book', {
          method: 'POST',
          body: JSON.stringify({ serviceId })
        });
        return response.json();
      },
      'Please sign in first to book a service.'
    );
  };

  return (
    <div>
      <h1>Welcome to Our Website</h1>
      
      {/* Browse freely - no login needed */}
      <section>
        <h2>Our Services</h2>
        {/* Service listings... */}
      </section>

      {/* Protected actions - shows popup if not logged in */}
      <button onClick={handlePlaceOrder}>
        Place Order
      </button>

      <button onClick={() => handleBookService('service-123')}>
        Book Service
      </button>
    </div>
  );
}
```

### HTML/JavaScript Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Home</title>
</head>
<body>
  <h1>Welcome</h1>
  
  <button id="place-order-btn">Place Order</button>
  <button id="book-service-btn">Book Service</button>

  <script type="module">
    import { startAuthPopupAutoShow } from './src/lib/authPopup.js';
    import { protectedAction } from './src/lib/protectedActions.js';

    // Initialize popup
    startAuthPopupAutoShow();

    // Handle place order
    document.getElementById('place-order-btn').addEventListener('click', async () => {
      await protectedAction(
        async () => {
          const response = await fetch('/api/orders', { method: 'POST' });
          console.log('Order placed!');
        },
        'Please sign in first to place an order.'
      );
    });

    // Handle book service
    document.getElementById('book-service-btn').addEventListener('click', async () => {
      await protectedAction(
        async () => {
          const response = await fetch('/api/services/book', { method: 'POST' });
          console.log('Service booked!');
        },
        'Please sign in first to book a service.'
      );
    });
  </script>
</body>
</html>
```

---

## 6. Customize Popup Timing

### Change Auto-Show Interval

```javascript
// In authPopup.js, line ~19
this.AUTO_SHOW_INTERVAL = 10000; // Change this value (in milliseconds)
// 10000 = 10 seconds
// 15000 = 15 seconds
// 20000 = 20 seconds
```

### Disable Auto-Show Temporarily

```javascript
import { stopAuthPopupAutoShow } from '@/lib/authPopup';

// Stop auto-showing
stopAuthPopupAutoShow();

// Later, start again
import { startAuthPopupAutoShow } from '@/lib/authPopup';
startAuthPopupAutoShow();
```

---

## 7. Check Login Status Anywhere

```javascript
import { isUserLoggedIn, getCurrentUser } from '@/lib/authUtils';

// Check if user is logged in
if (isUserLoggedIn()) {
  console.log('User is logged in!');
  
  // Get user info
  const user = getCurrentUser();
  console.log('User:', user.name, user.email);
} else {
  console.log('User is not logged in');
}
```

---

## Testing Checklist

- [ ] Open website - home page loads normally
- [ ] Wait 10 seconds - popup appears
- [ ] Close popup - can still browse website
- [ ] Wait 10 seconds again - popup appears again
- [ ] Click "Sign In" - goes to login page
- [ ] Login successfully - redirects to home
- [ ] Popup doesn't appear anymore (you're logged in)
- [ ] Click "Place Order" button - order is placed
- [ ] Logout - popup reappears after 10 seconds
- [ ] Chatbot input is disabled when not logged in
- [ ] Chatbot input is enabled when logged in

---

## Key Features

✅ **Non-Intrusive Popup**
- Doesn't block website browsing
- Can be closed anytime
- No UI changes to existing design

✅ **Smart Timing**
- Shows every 10 seconds if not logged in
- Only shows when not already visible
- Stops showing after login

✅ **Reusable Functions**
- `isUserLoggedIn()` - Check login status
- `protectedAction()` - Protect any action
- `requireAuth()` - Wrap functions
- `protectElementClick()` - Protect buttons

✅ **Clean Integration**
- No modifications to existing login/register pages
- Uses standard localStorage/sessionStorage
- Works with existing authentication system

---

## Troubleshooting

### Popup not appearing
- Make sure `startAuthPopupAutoShow()` is called on page load
- Check if user is actually logged out
- Open DevTools → Check localStorage for token

### Popup appearing after login
- Make sure login page calls `setAuthentication()`
- Check if localStorage has token saved
- Refresh page to ensure auth state is updated

### Protected action not working
- Make sure `protectedAction()` is properly imported
- Check that your login/register pages save the token
- Verify localStorage/sessionStorage is working

### Chatbot input not disabled
- Check if `isChatbotEnabled()` is used correctly
- Make sure input is bound to the right state
- Refresh page to ensure auth state is loaded

---

## Support

All functions are well-commented. Check the source files:
- `src/lib/authUtils.js` - Authentication utilities
- `src/lib/authPopup.js` - Popup logic
- `src/lib/protectedActions.js` - Access control
- `src/lib/chatbotAuth.js` - Chatbot authentication

---

**That's it!** Your authentication system is ready to use. No UI changes needed.
