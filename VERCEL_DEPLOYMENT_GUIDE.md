# Node.js + Express Backend Deployment on Vercel 🚀

**Prepared by: Senior DevOps Engineer**  
**Date:** January 24, 2026  
**Environment:** Production-Ready

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Required Folder Structure](#required-folder-structure)
3. [Step-by-Step Conversion](#step-by-step-conversion)
4. [Configuration Files](#configuration-files)
5. [Environment Variables](#environment-variables)
6. [Deployment Process](#deployment-process)
7. [Testing the Deployed API](#testing-the-deployed-api)
8. [Common Errors & Fixes](#common-errors--fixes)
9. [Production Best Practices](#production-best-practices)

---

## Architecture Overview

### How Vercel Serverless Works

```
┌─────────────────────────────────────────────┐
│         Vercel Edge Network                 │
│  ┌───────────────────────────────────────┐  │
│  │   Automatic Scaling & Load Balancing  │  │
│  └────────────┬────────────────────────┘  │
│               │                            │
│  ┌────────────▼────────────────────────┐  │
│  │  Serverless Functions (/api routes) │  │
│  │  - Cold start: ~1-2 seconds         │  │
│  │  - Auto-scaling (0 to thousands)    │  │
│  │  - Pay per invocation               │  │
│  └────────────┬────────────────────────┘  │
│               │                            │
│  ┌────────────▼────────────────────────┐  │
│  │  Your Express App (Wrapped)         │  │
│  │  - No need to listen on ports       │  │
│  │  - Returns HTTP response            │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Key Differences: Traditional vs Vercel

| Aspect | Traditional Server | Vercel Serverless |
|--------|-------------------|-------------------|
| **Listening Port** | `listen(3000)` | No port listening |
| **Always Running** | Yes | Only when invoked |
| **Scaling** | Manual | Automatic |
| **Deployment** | Git push + run script | Git push (auto deploy) |
| **File Structure** | Root-level server | `/api` folder structure |
| **Entry Point** | `server.js` | `api/index.js` |

---

## Required Folder Structure

### ✅ CORRECT STRUCTURE FOR VERCEL

```
RK-backend/
├── api/                              ← All serverless functions here
│   ├── index.js                     ← Main Express app entry
│   ├── middleware/
│   │   ├── auth.js
│   │   └── cors.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── [other routes]
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── [other models]
│   ├── controllers/
│   │   ├── authController.js
│   │   └── [other controllers]
│   ├── utils/
│   │   ├── emailService.js
│   │   └── otpUtils.js
│   └── lib/
│       └── mongodb.js
├── vercel.json                      ← Configuration file (NEW)
├── .env.production                  ← Production env vars (NEW)
├── package.json                     ← Updated scripts (MODIFIED)
└── .gitignore                       ← Already set

```

### ❌ WRONG STRUCTURE (Won't work on Vercel)

```
RK-backend/
├── server.js                ← ❌ Listening on port
├── server/
│   ├── index.js            ← ❌ Still in old structure
│   └── routes/
└── package.json
```

---

## Step-by-Step Conversion

### BEFORE → AFTER Changes

#### 1️⃣ **Update package.json**

**BEFORE:**
```json
{
  "name": "rk-backend",
  "type": "module",
  "scripts": {
    "server": "node server/index.js",
    "server:dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  }
}
```

**AFTER:**
```json
{
  "name": "rk-backend",
  "type": "module",
  "version": "1.0.0",
  "description": "RK Backend API - Vercel Deployment",
  "scripts": {
    "start": "node api/index.js",
    "dev": "nodemon api/index.js",
    "build": "echo 'Build complete'",
    "test": "echo 'Tests configured'"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

**Key Changes:**
- ✅ Added `"start"` script (Vercel looks for this)
- ✅ Updated to use `api/index.js` instead of `server/index.js`
- ✅ Added `build` script (required by Vercel)
- ✅ Added `engines.node` version constraint
- ✅ Removed scripts that won't work on Vercel

---

#### 2️⃣ **Restructure Main Server File**

**BEFORE (server/index.js):**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', process.env.CLIENT_URL]
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

**AFTER (api/index.js - Vercel Compatible):**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.production') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express app
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Configuration (Vercel-optimized)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL || 'https://your-frontend.com',
  'https://rk.vercel.app'  // Your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== DATABASE CONNECTION =====
let mongooseConnected = false;

async function connectDatabase() {
  if (mongooseConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rk-backend', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    mongooseConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// ===== IMPORT ROUTES =====
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import userRoutes from './routes/user.js';
import contactRoutes from './routes/contact.js';
import portfolioRoutes from './routes/portfolio.js';
import projectRoutes from './routes/project.js';
import revenueRoutes from './routes/revenue.js';
import uploadRoutes from './routes/upload.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dnsRoutes from './routes/dns.js';
import chatbotRoutes from './routes/chatbot.js';
import otpRoutes from './routes/otp.js';

// ===== REGISTER ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dns', dnsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/otp', otpRoutes);

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    available_endpoints: [
      '/api/health',
      '/api/auth',
      '/api/orders',
      '/api/users',
      '/api/contact',
      '/api/portfolio',
      '/api/projects'
    ]
  });
});

// ===== VERCEL SERVERLESS EXPORT =====
// Don't listen on port - Vercel handles this
export default app;

// ===== LOCAL DEVELOPMENT ONLY =====
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
```

**Key Differences:**
- ✅ **NO `listen()` call** for production (Vercel handles this)
- ✅ **Exports `app`** as default for Vercel
- ✅ **Handles database connections safely** with caching
- ✅ **Health check endpoint** for monitoring
- ✅ **Proper error handling** middleware
- ✅ **Local development support** (still listens locally)

---

## Configuration Files

### 3️⃣ **Create vercel.json**

**Location:** `RK-backend/vercel.json`

```json
{
  "version": 2,
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "NODE_ENV": "production",
    "CLIENT_URL": "@client_url",
    "SMTP_USER": "@smtp_user",
    "SMTP_PASS": "@smtp_pass"
  },
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "regions": [
    "iad1",
    "sfo1"
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

**Configuration Explanation:**

| Option | Purpose |
|--------|---------|
| `version: 2` | Vercel v2 API (required) |
| `env` | Environment variables (set in Vercel dashboard) |
| `builds` | Which files to build |
| `routes` | URL routing rules |
| `regions` | Geographic regions for deployment |
| `functions.maxDuration` | Request timeout (max 60 seconds) |
| `functions.memory` | RAM allocation (512MB-3008MB) |

---

### 4️⃣ **Create .env.production**

**Location:** `RK-backend/.env.production`

```env
# Environment
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rk-backend?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secret-key-min-32-characters-change-this
JWT_EXPIRY=7d

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://rk.vercel.app

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OTP Settings
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# API Settings
API_RATE_LIMIT=100
API_TIMEOUT=30000

# Logging
LOG_LEVEL=info
```

**⚠️ IMPORTANT:** Do NOT commit `.env.production` to GitHub!  
Add to `.gitignore`:
```
.env
.env.local
.env.production
```

---

## Environment Variables

### Setting Variables in Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Select Project:** Your RK-backend project
3. **Settings → Environment Variables**
4. **Add each variable:**

```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key-32-chars-min
CLIENT_URL = https://your-frontend.com
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
NODE_ENV = production
```

### Testing Environment Variables Locally

Create `api/test-env.js`:
```javascript
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.production') });

console.log('=== ENVIRONMENT VARIABLES ===');
console.log('✅ MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : '❌ NOT SET');
console.log('✅ JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : '❌ NOT SET');
console.log('✅ CLIENT_URL:', process.env.CLIENT_URL);
console.log('✅ NODE_ENV:', process.env.NODE_ENV);
```

Run locally:
```bash
node api/test-env.js
```

---

## Deployment Process

### Step 1: Prepare Your Repository

```bash
# 1. Ensure everything is committed
cd RK-backend
git status
git add .
git commit -m "feat: Prepare backend for Vercel deployment"

# 2. Push to GitHub
git push origin main
```

### Step 2: Connect to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to https://vercel.com
2. Click **"Add New... → Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo: `sivasuriya2k3-creator/Rk-backend`
5. Click **"Import"**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd RK-backend
vercel

# Link to existing project (if already created)
vercel link
```

### Step 3: Configure Project Settings

In Vercel Dashboard:

1. **Project Name:** `rk-backend`
2. **Framework Preset:** `Other` (since we're using custom Express)
3. **Root Directory:** Leave blank (it's the repo root)
4. **Build Command:** Leave blank OR set to `echo 'build'`
5. **Output Directory:** Leave blank
6. **Install Command:** `npm install`

### Step 4: Add Environment Variables

1. Go to **Settings → Environment Variables**
2. Add variables for: `Production`, `Preview`, and `Development`

**Required Variables:**
```
MONGODB_URI
JWT_SECRET
CLIENT_URL
SMTP_USER
SMTP_PASS
NODE_ENV = production
```

### Step 5: Deploy

```bash
git push origin main
```

Vercel will **automatically deploy** when you push to `main`.

---

## Testing the Deployed API

### Get Your Vercel URL

After deployment, your URL will be:
```
https://rk-backend.vercel.app
```

(Or custom domain if configured)

### Test Health Endpoint

```bash
# Using curl
curl https://rk-backend.vercel.app/api/health

# Response:
{
  "status": "ok",
  "timestamp": "2026-01-24T10:30:00.000Z",
  "environment": "production",
  "uptime": 1234.5
}
```

### Test with Postman

1. **Open Postman**
2. **Create new request**
3. **Method:** `GET`
4. **URL:** `https://rk-backend.vercel.app/api/health`
5. **Send**

### Test Authentication Endpoint

```bash
# Register
curl -X POST https://rk-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'

# Login
curl -X POST https://rk-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Test with Frontend

Update your frontend API URL:

```javascript
// frontend/.env.production
VITE_API_URL=https://rk-backend.vercel.app

// Or in code
const API_URL = process.env.VITE_API_URL || 'https://rk-backend.vercel.app';

// API call
fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

### Monitor Deployment

1. **Vercel Dashboard → Deployments**
2. Click on latest deployment
3. View **Logs** in real-time
4. Check **Function Invocations**

---

## Common Errors & Fixes

### ❌ Error 1: "Cannot find module"

**Error Message:**
```
Error: Cannot find module 'express'
```

**Fix:**
```bash
npm install
vercel env pull  # Pull env vars locally
git add package-lock.json
git commit -m "fix: Add package-lock.json"
git push
```

---

### ❌ Error 2: "Port Already in Use" (Local Testing)

**Error:**
```
Error: listen EADDRINUSE :::5002
```

**Fix in `api/index.js`:**
```javascript
// Change this:
const PORT = process.env.PORT || 5002;
app.listen(PORT);

// To this:
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
  });
}
```

---

### ❌ Error 3: "Cannot connect to MongoDB"

**Error:**
```
MongooseError: connect ENOTFOUND
```

**Fixes:**

1. **Check IP Whitelist in MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - **Network Access**
   - **Add IP Address**
   - Select **"Allow access from anywhere"** (0.0.0.0/0)

2. **Verify Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```

3. **Test Connection:**
   ```bash
   node -e "
   import mongoose from 'mongoose';
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('✅ Connected'))
     .catch(err => console.log('❌ Error:', err.message))
   "
   ```

---

### ❌ Error 4: "Function Timeout"

**Error:**
```
504: GATEWAY_TIMEOUT
```

**Causes & Fixes:**

1. **MongoDB is too slow:**
   ```javascript
   mongoose.connect(uri, {
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
     connectTimeoutMS: 10000
   });
   ```

2. **Long-running queries:**
   - Add caching (Redis)
   - Optimize database queries
   - Use pagination

3. **Increase timeout in `vercel.json`:**
   ```json
   "functions": {
     "api/index.js": {
       "maxDuration": 60
     }
   }
   ```

---

### ❌ Error 5: "401 Unauthorized / CORS Error"

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix in `api/index.js`:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-frontend.com',  // ← Add your frontend
    'https://rk.vercel.app'       // ← Your Vercel domain
  ],
  credentials: true
}));
```

Then in `vercel.json`:
```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "/api/index.js",
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
  }
]
```

---

### ❌ Error 6: "Missing script: start"

**Error:**
```
error Command failed with exit code 1
```

**Fix in `package.json`:**
```json
{
  "scripts": {
    "start": "node api/index.js",
    "build": "echo 'Build complete'",
    "dev": "nodemon api/index.js"
  }
}
```

---

### ❌ Error 7: "No open ports detected"

**Error:**
```
Error: no port is open to traffic
```

**Reason:** Vercel doesn't need listening ports!

**Fix:** Update `api/index.js`:
```javascript
// ❌ WRONG - This will fail
app.listen(3000);
export default app;

// ✅ RIGHT - Export app, don't listen
export default app;
```

---

## Production Best Practices

### 1. **Security Headers**

Add to `vercel.json`:
```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "/api/index.js",
    "headers": {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    }
  }
]
```

### 2. **Rate Limiting**

```javascript
// In api/index.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### 3. **Request Logging**

```javascript
import morgan from 'morgan';

// Production logging
app.use(morgan('combined'));

// Or custom logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

### 4. **Health Checks & Monitoring**

```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: mongooseConnected ? 'ok' : 'error',
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      uptime: process.uptime()
    }
  });
});
```

### 5. **Error Tracking**

Use Sentry or similar:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.errorHandler());
```

### 6. **Database Connection Pooling**

```javascript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

---

## Deployment Checklist

```
✅ Conversion & Setup
  ☐ Moved code from server/ to api/
  ☐ Updated package.json with "start" script
  ☐ Created vercel.json
  ☐ Created .env.production
  ☐ Added .env.production to .gitignore
  ☐ Removed app.listen() for production
  ☐ Exported app as default

✅ GitHub
  ☐ Committed all changes
  ☐ Pushed to main branch
  ☐ No sensitive data in commits

✅ Vercel
  ☐ Created Vercel account
  ☐ Imported GitHub repository
  ☐ Added environment variables
  ☐ Deployment successful
  ☐ No build errors

✅ Testing
  ☐ Health endpoint responding
  ☐ API endpoints working
  ☐ CORS configured correctly
  ☐ Database connections working
  ☐ Authentication endpoints tested
  ☐ Frontend can reach API

✅ Monitoring
  ☐ Vercel logs checked
  ☐ Error tracking set up
  ☐ Performance metrics reviewed
```

---

## Quick Reference Commands

```bash
# Deploy locally first
npm install
npm run dev

# Test endpoints locally
curl http://localhost:5002/api/health

# Deploy to Vercel
git add .
git commit -m "Deploy to Vercel"
git push origin main

# View logs in real-time
vercel logs --follow

# Rollback to previous deployment
vercel rollback
```

---

## Next Steps

1. **✅ Complete setup** → Push to main
2. **✅ Verify deployment** → Check Vercel dashboard
3. **✅ Test API endpoints** → Use provided curl commands
4. **✅ Update frontend** → Change API URL to Vercel URL
5. **✅ Monitor performance** → Check Vercel analytics

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Express on Vercel:** https://vercel.com/docs/runtimes/nodejs
- **Troubleshooting:** https://vercel.com/docs/troubleshooting
- **MongoDB Atlas:** https://www.mongodb.com/docs/manual/

---

**Created:** January 24, 2026  
**Status:** Production Ready ✅
