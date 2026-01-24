# VERCEL DEPLOYMENT - VISUAL REFERENCE & DIAGRAMS

## 1️⃣ Architecture Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser/App)                     │
│                                                             │
│  Makes API requests to: https://rk-backend.vercel.app     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Request
                         │
        ┌────────────────▼────────────────┐
        │   Vercel Edge Network          │
        │   (Global CDN)                 │
        │                                │
        │ • Handles CORS                 │
        │ • Routes requests              │
        │ • Caches responses             │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Serverless Function            │
        │  (api/index.js)                 │
        │                                │
        │ • Express app instance         │
        │ • Cold start: 1-2 sec         │
        │ • Auto scaling                 │
        │ • Timeout: 60 seconds          │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  MongoDB Atlas (Database)       │
        │                                │
        │ • Cluster in cloud             │
        │ • Connection pooling           │
        │ • IP whitelist: 0.0.0.0/0      │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Response to Client             │
        │  JSON Data                     │
        └─────────────────────────────────┘
```

---

## 2️⃣ Project Structure Diagram

```
RK-backend/
│
├── 📁 api/                          ← Vercel entry point
│   ├── 📄 index.js                 ← Main app (export default app)
│   │   ├── CORS setup
│   │   ├── Middleware
│   │   ├── Routes registration
│   │   └── Error handlers
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js              ← JWT verification
│   │   └── 📄 cors.js              ← CORS configuration
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.js              ← /api/auth
│   │   ├── 📄 orders.js            ← /api/orders
│   │   ├── 📄 users.js             ← /api/users
│   │   └── 📄 [other routes].js
│   │
│   ├── 📁 models/
│   │   ├── 📄 User.js              ← Schema
│   │   ├── 📄 Order.js
│   │   └── 📄 [other models].js
│   │
│   ├── 📁 controllers/
│   │   ├── 📄 authController.js
│   │   ├── 📄 orderController.js
│   │   └── 📄 [other controllers].js
│   │
│   └── 📁 utils/
│       ├── 📄 emailService.js
│       └── 📄 otpUtils.js
│
├── 📁 server/                       ← Keep for reference (optional)
│   ├── [same structure as api/]
│   └── [can be deleted after testing]
│
├── 📄 vercel.json                  ← Vercel configuration ✨ NEW
├── 📄 package.json                 ← Updated scripts ✨ UPDATED
├── 📄 .env.production              ← Production vars (not committed) ✨ NEW
├── 📄 .gitignore                   ← Updated with .env.production ✨ UPDATED
└── 📄 README.md
```

---

## 3️⃣ Deployment Workflow Diagram

```
┌─ LOCAL DEVELOPMENT ─────────────────────────────────────────┐
│                                                             │
│  1. Edit code in api/index.js                             │
│     └─> npm run dev (runs locally on :5002)               │
│                                                             │
│  2. Test endpoints                                         │
│     └─> curl http://localhost:5002/api/health             │
│                                                             │
│  3. Commit changes                                         │
│     └─> git add . && git commit -m "message"              │
│                                                             │
│  4. Push to GitHub                                         │
│     └─> git push origin main                              │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─ GITHUB WEBHOOK ────────────────────────────────────────────┐
│                                                             │
│  GitHub detects push to main branch                        │
│  └─> Sends webhook to Vercel                              │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─ VERCEL BUILD PROCESS ──────────────────────────────────────┐
│                                                             │
│  1. Read vercel.json                                       │
│  2. Run "npm install"                                      │
│  3. Run "npm run build" (if configured)                    │
│  4. Deploy api/index.js as serverless function            │
│  5. Assign URL: https://rk-backend-xxx.vercel.app         │
│                                                             │
│  Status: Building → Ready → Live ✅                        │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─ PRODUCTION ────────────────────────────────────────────────┐
│                                                             │
│  API is now live at: https://rk-backend-xxx.vercel.app    │
│                                                             │
│  Requests flow:                                            │
│  Client → Vercel Edge → Serverless Function → MongoDB     │
│                                                             │
│  Check status:                                             │
│  └─> curl https://rk-backend-xxx.vercel.app/api/health    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ File Conversion Reference

```
┌─────────────────────────────────────────────────────────────┐
│  Traditional Server                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  server/index.js                                           │
│  ├── import express                                        │
│  ├── const app = express()                                │
│  ├── app.use(middleware)                                   │
│  ├── app.use(routes)                                       │
│  │                                                         │
│  ├── ❌ app.listen(3000, () => {    ← WRONG FOR VERCEL   │
│  │       console.log('Server running');                   │
│  │     });                                                │
│  │                                                         │
│  └── No export                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ⬇️ CONVERT TO
                            
┌─────────────────────────────────────────────────────────────┐
│  Vercel Serverless                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  api/index.js                                              │
│  ├── import express                                        │
│  ├── const app = express()                                │
│  ├── app.use(middleware)                                   │
│  ├── app.use(routes)                                       │
│  │                                                         │
│  ├── ✅ if (NODE_ENV !== 'production') {                   │
│  │       app.listen(3000);  ← LOCAL DEV ONLY             │
│  │     }                                                   │
│  │                                                         │
│  ├── ✅ export default app;  ← REQUIRED FOR VERCEL       │
│  │                                                         │
│  └── No port listening in production                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ Request Lifecycle Diagram

```
User makes request:
curl https://rk-backend.vercel.app/api/auth/login

                 │
                 ▼
    ┌────────────────────────┐
    │  Vercel Edge Network   │
    │  • Check cache         │
    │  • Add security headers│
    │  • Route to function   │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Serverless Function    │
    │ api/index.js           │
    │ (Starts if first call) │
    │ • Load dependencies    │
    │ • Initialize app       │
    │ • Cold start: 1-2s     │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Express Middleware     │
    │ • Parse JSON           │
    │ • CORS check           │
    │ • Auth middleware      │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Route Handler          │
    │ /api/auth/login        │
    │ • Validate input       │
    │ • Query database       │
    │ • Hash password        │
    │ • Generate JWT         │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ MongoDB Database       │
    │ • Query users table    │
    │ • Return result        │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Response Sent          │
    │ {                      │
    │   "success": true,     │
    │   "token": "jwt...",   │
    │   "user": {...}        │
    │ }                      │
    └────────────────────────┘
```

---

## 6️⃣ Environment Variables Flow

```
Development
┌──────────────┐
│  .env        │  (Local environment)
└──────────────┘
      │
      └─> npm run dev
          ├─> Loads .env
          └─> Server runs on localhost:5002


Production (Vercel)
┌──────────────┐
│ .env.prod    │  (Not committed)
└──────────────┘
      │
      └─> git push origin main
          ├─> Webhook to Vercel
          ├─> Reads vercel.json
          ├─> Sets env from dashboard
          │
          └─> Serverless function
              ├─> MONGODB_URI=xxx
              ├─> JWT_SECRET=xxx
              ├─> CLIENT_URL=xxx
              └─> NODE_ENV=production
```

---

## 7️⃣ Vercel Deployment Status Diagram

```
                    Push to GitHub
                          │
                          ▼
                    ┌────────────┐
                    │  Building  │  (1-2 min)
                    │  - Install │
                    │  - Build   │
                    │  - Deploy  │
                    └────┬───────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
       ✅ Ready              ❌ Failed
       (Success)            (Check logs)
            │                         │
            ▼                         ▼
    Active & Listening      Fix error
    URL assigned            & retry
    Live traffic
```

---

## 8️⃣ Routing Flow Diagram

```
Request: GET /api/users

        ┌─────────────────────┐
        │  vercel.json routes │
        └────────┬────────────┘
                 │
        Match: /api/(.*)
                 │
                 ▼
        ┌─────────────────────┐
        │ api/index.js        │
        │ (Handler function)  │
        └────────┬────────────┘
                 │
        app.use('/api/users', userRoutes)
                 │
                 ▼
        ┌─────────────────────┐
        │ server/routes/      │
        │ user.js             │
        └────────┬────────────┘
                 │
        router.get('/', controller.getUsers)
                 │
                 ▼
        ┌─────────────────────┐
        │ server/controllers/ │
        │ userController.js   │
        └────────┬────────────┘
                 │
        Query MongoDB
                 │
                 ▼
        Response to Client
```

---

## 9️⃣ Performance Timeline Diagram

```
First Request (Cold Start):
├─ 0.0s: Request arrives
├─ 0.2s: Function initializes
├─ 0.5s: Dependencies loaded
├─ 1.0s: MongoDB connects
├─ 1.5s: Query executes
├─ 1.8s: Response sent
└─ Total: ~1.8 seconds ⚠️ (Acceptable)

Subsequent Requests (Warm):
├─ 0.0s: Request arrives
├─ 0.1s: Connection reused
├─ 0.3s: Query executes
├─ 0.4s: Response sent
└─ Total: ~0.4 seconds ✅ (Great)

Note: Times vary based on:
• Database query complexity
• Response size
• Network latency
• Memory allocated (1024MB recommended)
```

---

## 🔟 Error Handling Flow

```
Request comes in
        │
        ▼
    Try block
        │
    ┌───┴───┐
    │       │
    ▼       ▼
Success   Error
    │       │
    ▼       ▼
 Send   Error Handler
Response (Catch block)
    │       │
    │       ▼
    │   Log Error
    │       │
    │       ▼
    │   Return Error
    │   Response (500)
    │       │
    ├───┬───┤
    │   │   │
    ▼   ▼   ▼
  Client receives response
```

---

## 1️⃣1️⃣ CORS Request Flow

```
Browser makes request from:
https://rk.vercel.app

         │
         ▼
    ┌─────────────┐
    │ Send Origin │
    │ header      │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────┐
    │ api/index.js        │
    │ Check allowedOrigins│
    │ {                   │
    │   "https://rk.v..": ✅
    │   "http://local...": ✅
    │   "https://other":   ❌
    │ }                   │
    └──────┬──────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
✅ Allowed    ❌ Blocked
 │             │
 ▼             ▼
Add          Error
CORS         Response
Header       (403)
 │             │
 └──────┬──────┘
        ▼
   Send Response
```

---

## 1️⃣2️⃣ Database Connection Diagram

```
First Request:
┌────────────────┐
│ Function Start │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Check if       │
│ Connected?     │
└────────┬───────┘
         │
     No  │
         ▼
┌────────────────┐
│ Connect to     │
│ MongoDB        │
│ (1-1.5 sec)    │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Cache Conn.    │
│ mongooseConnected│
│ = true         │
└────────┬───────┘
         │
         ▼
    Execute Query

Subsequent Requests:
┌────────────────┐
│ Function Start │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Check if       │
│ Connected?     │
└────────┬───────┘
         │
     Yes │
         ▼
    Execute Query
(No delay!) ✅
```

---

## Summary: Key Takeaways

✅ **Vercel requires:**
- Export app as default
- No listening on ports (production)
- Proper environment variables
- CORS correctly configured

✅ **Deployment is automatic:**
- Push to main → Webhook sent → Auto deployed

✅ **Monitoring is easy:**
- Vercel Dashboard → Logs
- Real-time monitoring
- Deployment history

✅ **Scaling is automatic:**
- Vercel handles scaling
- No server configuration needed
- Pay-per-invocation model

---

**Visual Reference Created:** January 24, 2026  
**Status:** Ready for Deployment ✅
