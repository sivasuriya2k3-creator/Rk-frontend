# 🔧 Admin Dashboard Debugging Guide

## Quick Fix Steps

### Step 1: Check Backend Server
```powershell
# Navigate to project folder
cd "c:\Users\sivas\Documents\RK website\RK website"

# Start backend server
cd server
node index.js
```

**Expected Output:**
```
✓ Server running on http://localhost:5002
✓ MongoDB connected successfully
```

**If server doesn't start:**
- Check if port 5002 is already in use
- Verify MongoDB is running
- Check `server/index.js` for errors

---

### Step 2: Check Frontend Server
```powershell
# In a NEW terminal window
cd "c:\Users\sivas\Documents\RK website\RK website"

# Start frontend
npm run dev
# OR
pnpm dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 3: Test API Endpoints

#### Option A: Using the Test HTML Page
1. Open `test-admin-api.html` in your browser
2. Click "Load from localStorage" to get your auth token
3. Click "Test All APIs" to verify all endpoints

#### Option B: Using Browser Console
1. Open your app at http://localhost:5173
2. Login as admin
3. Open browser console (F12)
4. Run these commands:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Test health
fetch('http://localhost:5002/api/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d));

// Test users API
fetch('http://localhost:5002/api/users', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Users:', d));

// Test orders API
fetch('http://localhost:5002/api/orders/admin/all', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Orders:', d));

// Test revenue API
fetch('http://localhost:5002/api/revenue/stats', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Revenue:', d));
```

---

### Step 4: Check Browser Console for Errors

1. Open your app at http://localhost:5173
2. Login as admin
3. Go to Management Dashboard
4. Open Developer Tools (F12)
5. Go to Console tab
6. Look for these messages:

**Good Messages (What you WANT to see):**
```
Loading orders...
Orders loaded: Array(5) [ {...}, {...}, ... ]
Loading users...
Users loaded: Array(3) [ {...}, {...}, ... ]
Loading user stats...
User stats loaded: { totalUsers: 3, activeUsers: 2, ... }
Loading revenue...
Revenue loaded: { today: {...}, week: {...}, ... }
```

**Bad Messages (Problems):**
```
Load orders error: Error: Network Error
Load users error: AxiosError: Request failed with status code 401
Failed to load users: Unauthorized
```

---

### Step 5: Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the Management Dashboard page
4. Look for API calls:
   - `/api/users`
   - `/api/users/stats`
   - `/api/orders/admin/all`
   - `/api/revenue/stats`

**What to check:**
- ✅ Status Code should be **200** (success)
- ❌ Status Code **401** = Authentication problem
- ❌ Status Code **500** = Server error
- ❌ Status Code **404** = Route not found
- ❌ Status **(failed)** = Server not running

**Click on each request to see:**
- Request Headers (should have Authorization: Bearer token...)
- Response (should show data, not error)

---

## Common Issues & Solutions

### Issue 1: "No data showing in dashboard"

**Cause:** Backend server not running

**Solution:**
```powershell
cd server
node index.js
```

---

### Issue 2: "401 Unauthorized errors"

**Cause:** Not logged in as admin or token expired

**Solution:**
1. Logout
2. Login again with admin credentials
3. Go back to Management Dashboard

---

### Issue 3: "Network Error" or "Failed to fetch"

**Cause:** Backend server not running or wrong port

**Solution:**
1. Check if backend is running on port 5002
2. Verify `src/lib/api.ts` has correct URL: `http://localhost:5002/api`
3. Check CORS is enabled in `server/index.js`

---

### Issue 4: "Empty arrays returned"

**Cause:** No data in database

**Solution:**
1. Create test users
2. Create test orders
3. Check MongoDB has data:
```javascript
// In MongoDB
use golden-creative-hub
db.users.find()
db.orders.find()
```

---

### Issue 5: "Loading forever"

**Cause:** API request hanging

**Solution:**
1. Check browser console for errors
2. Check Network tab for pending requests
3. Restart backend server
4. Clear browser cache and reload

---

## Enhanced Logging

The dashboard now has detailed console logging. Open browser console to see:

```
Loading orders...
Orders loaded: [array of orders]
Loading users...
Users loaded: [array of users]
Loading user stats...
User stats loaded: { totalUsers: X, activeUsers: Y, ... }
Loading revenue...
Revenue loaded: { today: {...}, week: {...}, ... }
```

**If you see errors:**
```
Load orders error: [error object]
Error details: { message: "...", ... }
```

This tells you exactly which API call failed and why!

---

## Quick Test Script

Save this as `test-api.js` and run with Node:

```javascript
const API_BASE = 'http://localhost:5002/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  // Test health
  console.log('1. Health Check:');
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log('✅ Health:', data);
  } catch (err) {
    console.log('❌ Health failed:', err.message);
  }
  
  console.log('\n2. Get token from your browser localStorage and paste here');
  console.log('Then use it to test authenticated endpoints');
}

testAPI();
```

---

## Still Having Issues?

1. **Restart everything:**
   ```powershell
   # Stop all servers (Ctrl+C)
   # Start backend
   cd server
   node index.js
   
   # Start frontend (new terminal)
   npm run dev
   ```

2. **Check MongoDB:**
   ```powershell
   # Check if MongoDB is running
   # Start MongoDB if needed
   ```

3. **Clear browser data:**
   - Clear localStorage
   - Clear cache
   - Hard refresh (Ctrl+Shift+R)

4. **Check firewall:**
   - Allow Node.js through Windows Firewall
   - Allow localhost connections

---

## Success Checklist

- [ ] Backend server running on port 5002
- [ ] Frontend running on port 5173
- [ ] MongoDB connected successfully
- [ ] Logged in as admin user
- [ ] Console shows "Loading..." messages
- [ ] Console shows "loaded:" messages with data
- [ ] No red errors in console
- [ ] Network tab shows 200 status codes
- [ ] Dashboard displays data in tables

---

## Contact Information

If all else fails, check:
1. `server/index.js` - Backend routes
2. `src/lib/api.ts` - API configuration
3. `src/pages/ManagementDashboard.tsx` - Data loading functions
4. Browser DevTools Console - Error messages
5. Browser DevTools Network - Request/Response details
