# VERCEL DEPLOYMENT - QUICK REFERENCE CARD 🚀

**Print this page for quick access during deployment!**

---

## ⚡ Critical Commands

```bash
# Test locally
npm run dev
curl http://localhost:5002/api/health

# Deploy
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Check status
vercel status
vercel logs --follow

# Redeploy
vercel redeploy
```

---

## 📋 Must-Do Checklist

```
Before Deployment:
☐ api/index.js exists
☐ No app.listen() in production
☐ export default app present
☐ package.json has "start" script
☐ vercel.json created
☐ .env.production created
☐ .env.production in .gitignore
☐ All changes committed

After Deployment:
☐ Vercel shows "Ready"
☐ Health endpoint responds
☐ Database connected
☐ Logs show no errors
☐ Frontend can call API
```

---

## 🔑 Environment Variables (Production)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret-key-32-chars-min
NODE_ENV=production
CLIENT_URL=https://frontend-domain.com
SMTP_USER=email@gmail.com
SMTP_PASS=app-password
```

---

## 📁 Folder Structure (REQUIRED)

```
api/                          ← Entry point
├── index.js                 ← export default app
├── routes/
├── models/
├── controllers/
└── utils/

vercel.json                  ← Configuration
package.json                 ← "start" script
.env.production              ← Env vars (NOT committed)
```

---

## ✅ 5-Minute Setup

### 1. Update package.json
```json
{
  "scripts": {
    "start": "node api/index.js",
    "build": "echo 'Build complete'"
  }
}
```

### 2. Create vercel.json
```json
{
  "version": 2,
  "builds": [{"src": "api/index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/api/(.*)", "dest": "/api/index.js"}]
}
```

### 3. Update api/index.js
```javascript
// NO LISTENING
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
}

// REQUIRED
export default app;
```

### 4. Push
```bash
git add . && git commit -m "Deploy" && git push origin main
```

### 5. Set Env Vars in Vercel Dashboard
- Settings → Environment Variables
- Add MONGODB_URI, JWT_SECRET, etc.

---

## 🧪 Test Endpoints

```bash
# Health
curl https://rk-backend.vercel.app/api/health

# Database
curl https://rk-backend.vercel.app/api/health/db

# Login (example)
curl -X POST https://rk-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

---

## ⚠️ Common Mistakes

| ❌ Wrong | ✅ Right |
|---------|---------|
| `app.listen(3000)` in prod | Only in dev: `if (NODE_ENV !== 'prod')` |
| Missing `export default app` | `export default app;` at end |
| `"server": "node ..."` script | `"start": "node api/index.js"` |
| No vercel.json | Create vercel.json with routes |
| Commit .env.production | Add to .gitignore |
| `api/routes.js` | Put routes in `api/routes/` folder |

---

## 🔍 Debugging

```bash
# View logs
vercel logs rk-backend --follow

# Test env vars
npm run dev && LOCAL_DEV=true node api/test-env.js

# Check connection
curl -v https://rk-backend.vercel.app/api/health

# Pull env vars
vercel env pull
```

---

## 📊 Status Indicators

| ✅ Good | ❌ Problem |
|--------|-----------|
| Response time < 500ms | Response time > 2s |
| Memory < 400MB | Memory > 500MB |
| Uptime 100% | Uptime < 99% |
| No build errors | Build failed |
| All endpoints respond | 404/500 errors |

---

## 🚨 Quick Fixes

**Can't find module:**
```bash
npm install && git add package-lock.json && git push
```

**504 Timeout:**
- Check MongoDB (whitelist IP)
- Optimize queries
- Increase maxDuration in vercel.json

**CORS Error:**
- Add frontend URL to allowedOrigins in api/index.js
- Push changes

**No Database Connection:**
- MongoDB Atlas → Network Access → Add 0.0.0.0/0
- Check MONGODB_URI in Vercel

---

## 📞 URLs & Resources

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Project Logs | https://vercel.com/dashboard → Deployments |
| MongoDB Atlas | https://cloud.mongodb.com |
| Vercel Docs | https://vercel.com/docs |

---

## 🎯 Success = Green Checkmarks

```
✅ Deployment: Ready
✅ Build: Successful
✅ Health Endpoint: 200 OK
✅ Database: Connected
✅ CORS: Allowed
✅ API Response: < 1s
✅ Frontend: Communicating
✅ Logs: No errors

🚀 YOU'RE LIVE!
```

---

## 📝 Before & After Code

### ❌ BEFORE (Traditional)
```javascript
// server/index.js
const app = express();
app.use(middleware);
app.listen(3000);  // ← WRONG
```

### ✅ AFTER (Vercel)
```javascript
// api/index.js
const app = express();
app.use(middleware);
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);  // ← Only local
}
export default app;  // ← REQUIRED
```

---

## 🔑 Single Command Deploy

```bash
# After all setup:
git add . && git commit -m "Deploy to Vercel" && git push origin main
# Done! Vercel deploys automatically
```

---

## 📞 Vercel URL After Deployment

```
https://rk-backend-[random-id].vercel.app

Get it from:
• Vercel Dashboard
• Deployment URL
• CLI output
```

---

## 💾 Backup Commands

```bash
# Rollback to previous version
vercel rollback

# List deployments
vercel ls

# Delete deployment
vercel remove [deployment-url]
```

---

## 🎓 Learning Order

1. This card (Overview)
2. VERCEL_DEPLOYMENT_STEPS.md (How-to)
3. VERCEL_CODE_EXAMPLES.js (Code)
4. VERCEL_TROUBLESHOOTING.md (Errors)
5. VERCEL_DEPLOYMENT_GUIDE.md (Deep dive)

---

## 🔔 Remember

- ✅ **NO listening on ports in production**
- ✅ **Export app as default**
- ✅ **Create vercel.json**
- ✅ **Set environment variables in dashboard**
- ✅ **Push to main for auto-deploy**
- ✅ **Test health endpoint after deploy**

---

## 📞 Emergency Contacts

| Problem | Action |
|---------|--------|
| Build failed | Check Vercel logs |
| API not responding | Check health endpoint |
| Database error | Check MongoDB Atlas |
| CORS blocked | Add origin to allowedOrigins |
| Timeout | Optimize queries |

---

## ⏱️ Timeline

- **Setup:** 10-15 minutes
- **First Deploy:** 2-3 minutes
- **Testing:** 5 minutes
- **Total:** ~20 minutes

---

## 🎉 Success Indicators

You'll know it's working when:

```
✅ vercel.com shows "Deployment Successful"
✅ https://your-project.vercel.app/api/health returns 200
✅ Logs show "✅ MongoDB connected"
✅ Frontend calls work without CORS errors
✅ Response time is < 1 second
```

---

**Last Updated:** January 24, 2026  
**Status:** ✅ Ready to Deploy  
**Difficulty:** Beginner-Friendly

---

## Quick Screenshot Reference

```
VERCEL DASHBOARD:
├── Projects
│   └── rk-backend
│       ├── Deployments
│       │   └── ✅ READY (Latest)
│       ├── Settings
│       │   └── Environment Variables
│       │       ├── MONGODB_URI
│       │       ├── JWT_SECRET
│       │       └── CLIENT_URL
│       └── Functions
│           └── api/index.js (1024MB, 60s)
```

---

## One-Page Summary

```
What:     Deploy Node.js+Express backend
Where:    Vercel (serverless platform)
Why:      Auto-scaling, global CDN, free tier
How:      Push to GitHub, Vercel auto-deploys
When:     When ready for production
Cost:     Free for hobby, $20+/month for pro

Key Steps:
1. Update package.json ← "start" script
2. Create vercel.json ← Routes config
3. Update api/index.js ← export default app
4. Set env vars ← Vercel dashboard
5. Push to main ← Git push
6. Done! ← Auto-deployed

Test: curl https://your-project.vercel.app/api/health
```

---

**Print this and keep it handy! 📄**

Questions? Check the full guide documents!
