# VERCEL DEPLOYMENT - TROUBLESHOOTING GUIDE

## 📊 Deployment Checklist

Use this to track your progress:

```
Phase 1: Preparation
  ☐ Backend code is ready
  ☐ All tests pass locally
  ☐ Git repository initialized
  ☐ Committed all changes

Phase 2: Configuration Files
  ☐ vercel.json created
  ☐ .env.production created
  ☐ .gitignore updated
  ☐ package.json has "start" script

Phase 3: Code Updates
  ☐ api/index.js created
  ☐ No app.listen() for production
  ☐ app exported as default
  ☐ Routes imported correctly

Phase 4: GitHub Sync
  ☐ All files committed
  ☐ Pushed to main branch
  ☐ No sensitive data in repo

Phase 5: Vercel Setup
  ☐ Vercel account created
  ☐ GitHub repo imported
  ☐ Environment variables added
  ☐ Initial deployment successful

Phase 6: Testing
  ☐ Health endpoint responds
  ☐ Database connected
  ☐ API endpoints working
  ☐ CORS configured correctly
```

---

## 🚨 Common Errors & Solutions

### Error 1: "Function was not exported"

```
ERROR: Function was not exported from api/index.js
```

**Cause:** Missing `export default app`

**Fix:**
```javascript
// At the END of api/index.js
export default app;  // ✅ REQUIRED
```

---

### Error 2: "Cannot find module 'express'"

```
Error: Cannot find module 'express'
```

**Cause:** Dependencies not installed

**Fix:**
```bash
# Delete lock file and reinstall
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

---

### Error 3: "listen EADDRINUSE :::5002"

```
Error: listen EADDRINUSE :::5002
```

**Cause:** Port already in use locally

**Fix:**
```bash
# Option 1: Use different port
PORT=5003 npm run dev

# Option 2: Kill process using port 5002
# Windows: netstat -ano | findstr :5002
# Mac/Linux: lsof -i :5002

# Option 3: Fix code to not listen in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(5002);
}
export default app;
```

---

### Error 4: "No open ports detected"

```
ERROR: no open ports detected
```

**Cause:** Vercel detected app.listen() in production

**Fix:**
```javascript
// ❌ WRONG
const PORT = 3000;
app.listen(PORT);
export default app;

// ✅ RIGHT - Don't listen on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
}
export default app;
```

---

### Error 5: "MongooseError: connect ENOTFOUND"

```
Error: connect ENOTFOUND
MongoError: Failed to connect to MongoDB
```

**Causes & Fixes:**

**Cause 1: IP not whitelisted**
- Go to MongoDB Atlas
- Network Access → Allow Access from Anywhere (0.0.0.0/0)

**Cause 2: Wrong connection string**
- Check format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- Test locally: `npm run dev` and check logs

**Cause 3: Invalid credentials**
```bash
# Test connection
mongo "mongodb+srv://username:password@cluster.mongodb.net/test"
```

**Cause 4: Firewall blocking**
- Use MongoDB Atlas (cloud) instead of local MongoDB
- Ensure connection string has `?retryWrites=true`

---

### Error 6: "504 Gateway Timeout"

```
504: GATEWAY TIMEOUT
Error: Function invocation timed out
```

**Causes & Fixes:**

**Solution 1: Increase timeout in vercel.json**
```json
"functions": {
  "api/index.js": {
    "maxDuration": 60,
    "memory": 1024
  }
}
```

**Solution 2: Optimize database queries**
```javascript
// ❌ SLOW - Retrieving all data
const users = await User.find();

// ✅ FAST - With limits
const users = await User.find().limit(20);
const users = await User.find().select('name email').limit(20);
```

**Solution 3: Add caching**
```javascript
app.get('/api/users', (req, res) => {
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  // ... return data
});
```

---

### Error 7: "CORS blocked: Origin not allowed"

```
Access to XMLHttpRequest blocked by CORS policy
Origin not allowed by Access-Control-Allow-Origin
```

**Fix in api/index.js:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-frontend-domain.com',  // ← Add here
  'https://rk.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

**Then restart deployment:**
```bash
git add .
git commit -m "fix: Update CORS origins"
git push origin main
```

---

### Error 8: "401 Unauthorized - Invalid token"

```
Error: Invalid token
401: Unauthorized
```

**Fix:**
1. Check JWT_SECRET in Vercel environment variables
2. Ensure it matches between frontend and backend
3. Test token generation locally

```bash
# Check env vars are set
curl https://rk-backend.vercel.app/api/health

# Should show: "database": "connected"
```

---

### Error 9: "502 Bad Gateway"

```
502: BAD GATEWAY
```

**Causes:**
- Deployment still in progress
- Build failed
- Runtime error in code

**Fix:**
1. Check Vercel Deployments
2. Click on deployment to view logs
3. Look for error messages in "Function logs"
4. Fix the error in code
5. Push to main to redeploy

---

### Error 10: "Build failed: npm ERR!"

```
npm ERR! Could not resolve dependency
npm ERR! peer dep missing
```

**Fix:**
```bash
# Reinstall dependencies
npm install

# Install missing peer deps
npm install --save-peer

# Commit and push
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push origin main
```

---

## 📋 Testing Checklist After Deployment

### ✅ Test 1: Endpoint Accessibility

```bash
# Get your Vercel URL
VERCEL_URL="https://rk-backend-xxx.vercel.app"

# Test root endpoint
curl $VERCEL_URL
# Expected: 200 OK with API info

# Test health check
curl $VERCEL_URL/api/health
# Expected: 200 OK with status info

# Test non-existent endpoint
curl $VERCEL_URL/api/nonexistent
# Expected: 404 Not Found
```

### ✅ Test 2: Database Connectivity

```bash
# Test database health
curl $VERCEL_URL/api/health/db

# Expected response:
{
  "status": "ok",
  "database": "MongoDB connected",
  "timestamp": "2026-01-24T..."
}
```

### ✅ Test 3: CORS Configuration

```bash
# Test CORS from browser
cat > test-cors.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
<script>
  fetch('https://rk-backend-xxx.vercel.app/api/health')
    .then(r => r.json())
    .then(d => console.log('✅ Success:', d))
    .catch(e => console.error('❌ Error:', e));
</script>
</body>
</html>
EOF

# Open in browser and check console
```

### ✅ Test 4: API Endpoints

```bash
# Test POST request
curl -X POST $VERCEL_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Test GET with query
curl "$VERCEL_URL/api/orders?limit=10&page=1"

# Test DELETE with auth
curl -X DELETE $VERCEL_URL/api/orders/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### ✅ Test 5: Performance

```bash
# Check response time
time curl $VERCEL_URL/api/health

# Check function duration in Vercel logs
vercel logs $VERCEL_URL --follow
```

---

## 🔍 Debugging Techniques

### View Real-time Logs

```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs rk-backend --follow

# View specific deployment logs
vercel logs rk-backend --since 1h
```

### Check Environment Variables

```bash
# Pull and view env vars (locally)
vercel env pull
cat .env.local
```

### Simulate Vercel Environment Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally with Vercel environment
vercel dev

# Or with environment file
vercel dev --env-file .env.production
```

### Test Database Connection

```bash
# Create test script
cat > test-db.js << 'EOF'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.production' });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Testing connection to:', MONGODB_URI?.slice(0, 50) + '...');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
EOF

# Run it
node test-db.js
```

---

## 🚀 Performance Optimization

### Reduce Cold Start Time

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024,
      "runtime": "nodejs18.x"
    }
  }
}
```

### Enable Caching

```javascript
// In api/index.js
app.get('/api/static-data', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({ data: 'This will be cached for 1 hour' });
});
```

### Optimize Database Queries

```javascript
// ❌ Slow
const user = await User.findById(id);

// ✅ Fast
const user = await User.findById(id).select('name email avatar');

// ✅ Very Fast (with caching)
const user = await User.findById(id)
  .select('name email avatar')
  .lean(); // Returns plain JS object, not Mongoose doc
```

---

## 📞 Getting Help

### Check Vercel Status

```bash
# Check deployment status
vercel status

# List recent deployments
vercel ls rk-backend
```

### Review Logs

```bash
# Last 50 lines
vercel logs rk-backend -n 50

# Real-time
vercel logs rk-backend --follow

# Specific deployment
vercel logs rk-backend --deployment xxx
```

### Common Issues & Resources

- **MongoDB Connection:** https://www.mongodb.com/docs/manual/reference/connection-string/
- **Vercel Limits:** https://vercel.com/docs/functions/limitations
- **Node.js on Vercel:** https://vercel.com/docs/runtimes/nodejs
- **Express Deployment:** https://vercel.com/docs/frameworks/express

---

## 🔑 Quick Reference: Environment Variables

### Required for Production

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-key-32-chars-min
NODE_ENV=production
CLIENT_URL=https://your-frontend.com
```

### Optional But Recommended

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
SMTP_HOST=smtp.gmail.com
LOG_LEVEL=info
API_RATE_LIMIT=100
```

### Testing Locally

```bash
# Create .env.production file
echo "MONGODB_URI=your-connection-string" > .env.production
echo "JWT_SECRET=your-secret-key" >> .env.production

# Run with Vercel CLI
vercel dev
```

---

## ✅ Final Deployment Verification

```
Before deploying to production:

✅ Code
  ☐ No console.error() calls (clean logs)
  ☐ Proper error handling
  ☐ Environment variables used correctly
  ☐ No hardcoded secrets

✅ Performance
  ☐ Database queries optimized
  ☐ Response time < 2 seconds
  ☐ Memory usage < 500MB
  ☐ Cold start < 5 seconds

✅ Security
  ☐ CORS properly configured
  ☐ JWT validation enabled
  ☐ Rate limiting enabled
  ☐ Input validation in place

✅ Monitoring
  ☐ Error logging configured
  ☐ Health endpoints working
  ☐ Logs accessible
  ☐ Alerts set up (optional)
```

---

**Last Updated:** January 24, 2026  
**Status:** Production Ready ✅
