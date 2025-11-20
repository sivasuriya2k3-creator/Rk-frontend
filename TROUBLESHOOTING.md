# Troubleshooting Guide

## Common Issues & Solutions

### 1. MongoDB Connection Issues

#### Problem: "MongooseError: Cannot connect to MongoDB"
**Causes:**
- MongoDB service is not running
- Wrong connection string
- MongoDB not installed
- Network/firewall issues

**Solutions:**

**For Local MongoDB:**
```bash
# Windows - Check MongoDB service status
Get-Service MongoDB

# Windows - Start MongoDB
Start-Service MongoDB

# macOS - Start MongoDB with Homebrew
brew services start mongodb-community

# Linux - Start MongoDB
sudo systemctl start mongod
```

**For MongoDB Atlas:**
```bash
# 1. Verify connection string format:
mongodb+srv://username:password@cluster.mongodb.net/database

# 2. Check these common issues:
# - Username/password special characters need URL encoding
# - IP address must be whitelisted in Atlas
# - Network access rules configured
# - Cluster is awake (not paused)
```

**Test connection:**
```bash
# Using MongoDB shell
mongosh "mongodb://localhost:27017"

# If successful, you should see: test>
```

---

### 2. CORS Errors

#### Problem: "Access to XMLHttpRequest blocked by CORS policy"
**Causes:**
- CLIENT_URL in .env doesn't match frontend URL
- Browser and server on different ports
- CORS headers not properly configured

**Solution:**

Check your `.env` file:
```env
CLIENT_URL=http://localhost:5173  # Must match your frontend URL
```

If frontend is running on different port:
```env
CLIENT_URL=http://localhost:3000  # Update to your frontend port
```

**Restart backend after changing:**
```bash
# Stop with Ctrl+C
# Restart
npm run server:dev
```

---

### 3. Port Already in Use

#### Problem: "listen EADDRINUSE: address already in use :::5000"
**Causes:**
- Another application using port 5000
- Previous server process still running

**Solutions:**

**Option 1: Use different port**
```env
PORT=5001
# or any available port
```

**Option 2: Kill process using port**

**Windows:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

### 4. JWT/Authentication Issues

#### Problem: "Not authorized to access this route"
**Causes:**
- Token not being sent
- Token expired
- Token invalid/corrupted
- Malformed Authorization header

**Solutions:**

**Check token in browser:**
```javascript
// Open browser console and run:
localStorage.getItem('token')

// Should output: "eyJhbGciOiJIUzI1NiIs..."
```

**Check Authorization header:**
```bash
# Make API request and check response headers
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

**Token structure:**
```
Authorization: Bearer <token>
    ↓
    Exactly "Bearer" with space, then token
```

**Reset authentication:**
```javascript
// Run in browser console:
localStorage.clear()
// Then refresh page and login again
```

---

### 5. Dependencies Issues

#### Problem: "Cannot find module 'express'" or similar
**Causes:**
- Dependencies not installed
- npm install failed partially
- node_modules deleted

**Solution:**

```bash
# Clean install
rm -r node_modules
rm package-lock.json

# Reinstall
npm install

# Verify
npm list | head -20
```

---

### 6. Environment Variable Issues

#### Problem: "MONGODB_URI is undefined" or similar
**Causes:**
- .env file not created
- .env file in wrong location
- Variables not loaded properly

**Solution:**

**Verify .env file:**
```bash
# Check if .env exists in project root
ls -la | grep ".env"

# Should show: .env
```

**Check .env content:**
```bash
cat .env
# Should show your variables
```

**Ensure file location:**
```
golden-creative-hub-main/
├── .env ← Should be here
├── package.json
├── server/
└── src/
```

**Restart server after creating .env:**
```bash
npm run server:dev
```

---

### 7. Database Issues

#### Problem: "ValidationError: email is required"
**Causes:**
- Missing required fields in request
- Wrong data types
- Validation rules not met

**Solution:**

Check request data:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "test123456",
    "confirmPassword": "test123456"
  }'
```

Required fields per endpoint:
- **Register**: name, email, password, confirmPassword
- **Portfolio**: title, description, category, image
- **Contact**: name, email, subject, message

---

### 8. Login Issues

#### Problem: "Invalid credentials"
**Causes:**
- Wrong email or password
- User doesn't exist
- Case sensitivity in email

**Solution:**

```bash
# Verify user exists in database
mongosh
use golden-creative-hub
db.users.findOne({ email: "your@email.com" })

# Should return user object, if not, user doesn't exist

# Test password reset if needed
# Or create new test user
```

---

### 9. Frontend Issues

#### Problem: "Cannot find module 'axios'" in frontend
**Causes:**
- axios not installed
- TypeScript import issue
- Path alias not configured

**Solution:**

```bash
# Install missing package
npm install axios

# Verify in package.json dependencies
npm list axios

# Check import statement
import api from '@/lib/api.ts';  # Should use @/ alias
```

---

### 10. Build Issues

#### Problem: "vite build fails" or "npm run build errors"
**Causes:**
- TypeScript errors
- Missing dependencies
- Import/export issues

**Solution:**

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run linting to find issues
npm run lint

# Check which file has the error
npm run build --verbose

# Fix errors in the reported file
```

---

## Performance Issues

### Problem: Server responses are slow
**Solutions:**

1. **Check MongoDB connection:**
```bash
# Time a query
time mongosh --eval "db.adminCommand('ping')"
```

2. **Monitor server logs:**
```bash
# Add logging to see query times
NODE_DEBUG=mongodb npm run server:dev
```

3. **Optimize queries:**
- Add database indexes
- Avoid N+1 queries
- Use lean() for read-only queries

---

## Browser Console Errors

### Problem: "Cannot read property 'user' of undefined"
**Cause:** Auth context not properly wrapped

**Solution:**
Ensure App.tsx is wrapped with AuthProvider:
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

---

### Problem: "localStorage is not defined"
**Cause:** Server-side rendering issue

**Solution:**
Check if code runs in browser:
```ts
if (typeof window !== 'undefined') {
  localStorage.getItem('token');
}
```

---

## Network/Connection Issues

### Problem: "Failed to fetch" errors
**Causes:**
- Backend not running
- Wrong API URL
- Network connectivity issue

**Solution:**

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"Server is running"}

# Check frontend API URL
# Open .env and verify VITE_API_URL
cat .env | grep VITE_API_URL

# Should be: VITE_API_URL=http://localhost:5000/api
```

---

## Memory Leaks

### Problem: App slows down over time
**Solutions:**

1. **Check Node version:**
```bash
node --version  # Should be v14 or higher
```

2. **Monitor memory usage:**
```bash
# Windows
tasklist | findstr node

# macOS/Linux
ps aux | grep node
```

3. **Restart server periodically in development:**
```bash
# Server auto-restarts with nodemon
# If needed, manually restart:
npm run server:dev
```

---

## Getting Help

### Debug Mode

Enable debug logging:
```bash
# Windows PowerShell
$env:DEBUG='*'; npm run server:dev

# macOS/Linux
DEBUG=* npm run server:dev
```

### Check Logs

```bash
# View last 100 lines of logs
tail -100 npm-debug.log

# Search for errors
grep -i error npm-debug.log
```

### Use Browser DevTools

1. **Network Tab**
   - Check API requests
   - View response data
   - Check status codes

2. **Console Tab**
   - View JavaScript errors
   - Check localStorage
   - Test API calls

3. **Application Tab**
   - View localStorage data
   - Check cookies
   - Monitor state

---

## Emergency Reset

If everything is broken, try this:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear node modules
rm -r node_modules
rm package-lock.json

# 3. Clear .env (start fresh)
rm .env

# 4. Clear browser data
# In browser: DevTools > Application > Clear Storage

# 5. Clear MongoDB (WARNING: deletes all data!)
# mongosh
# use golden-creative-hub
# db.users.deleteMany({})
# db.portfolios.deleteMany({})
# db.contacts.deleteMany({})

# 6. Reinstall everything
npm install

# 7. Recreate .env
node setup.js

# 8. Start fresh
npm run dev:full
```

---

## Still Need Help?

Check these resources:

1. **Express.js Docs**: https://expressjs.com/
2. **MongoDB Docs**: https://docs.mongodb.com/
3. **React Docs**: https://react.dev/
4. **Mongoose Docs**: https://mongoosejs.com/
5. **JWT Docs**: https://jwt.io/

Or check the documentation files:
- `QUICK_START.md` - Quick setup guide
- `BACKEND_SETUP.md` - Detailed backend setup
- `server/README.md` - API documentation
- `ARCHITECTURE.md` - System architecture

---

**Most issues are resolved by:**
1. Checking `.env` file is correct
2. Restarting the server
3. Clearing browser localStorage and cache
4. Reinstalling dependencies

Try these first! ✅
