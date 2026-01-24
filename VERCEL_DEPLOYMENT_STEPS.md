# VERCEL DEPLOYMENT - STEP-BY-STEP IMPLEMENTATION GUIDE

## Phase 1: Prepare Your Backend Structure

### Step 1.1: Copy Backend to New Location for Vercel

**Current Structure:**
```
RK-backend/
├── server/
├── api/
├── package.json
└── .gitignore
```

**Target Structure for Vercel:**
```
RK-backend/
├── api/                          ← Vercel looks here
│   ├── index.js                 ← Main entry point (RENAMED from server/index.js)
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── utils/
├── server/                       ← Keep for reference (optional)
├── vercel.json                  ← NEW
├── .env.production              ← NEW
├── package.json                 ← MODIFIED
└── .gitignore
```

### Step 1.2: Update package.json

**Location:** `RK-backend/package.json`

**Changes Required:**

```json
{
  "name": "rk-backend",
  "type": "module",
  "version": "1.0.0",
  "description": "RK Backend API - Vercel Deployment",
  "main": "api/index.js",
  "scripts": {
    "start": "node api/index.js",
    "dev": "LOCAL_DEV=true nodemon api/index.js",
    "build": "echo 'Build complete'",
    "test": "echo 'Tests configured'",
    "vercel-build": "npm install"
  },
  "engines": {
    "node": "18.x",
    "npm": ">=9.0.0"
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

---

## Phase 2: Create Configuration Files

### Step 2.1: Create vercel.json

**Location:** `RK-backend/vercel.json`

```json
{
  "version": 2,
  "name": "rk-backend",
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
      "dest": "/api/index.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "regions": ["iad1"],
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

---

### Step 2.2: Create .env.production

**Location:** `RK-backend/.env.production`

⚠️ **DO NOT COMMIT THIS FILE** - Add to `.gitignore`

```env
# Environment
NODE_ENV=production
LOCAL_DEV=false

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rk-backend

# Security
JWT_SECRET=your-super-secret-key-minimum-32-characters-change-this
JWT_EXPIRY=7d

# Frontend
CLIENT_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://rk.vercel.app

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OTP
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# API
API_TIMEOUT=30000
API_RATE_LIMIT=100
```

---

### Step 2.3: Update .gitignore

**Location:** `RK-backend/.gitignore`

```
# Environment Variables
.env
.env.local
.env.production
.env.*.local
.env.*.production

# Dependencies
node_modules/
package-lock.json

# Build
dist/
build/
.next/
.nuxt/
coverage/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
.env.local
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Uploads
uploads/
public/uploads/

# Cache
.cache/
tmp/
```

---

## Phase 3: Update api/index.js

### Step 3.1: Replace api/index.js Content

**Key Requirements:**

1. **No `.listen()` for production**
2. **Export app as default**
3. **Proper error handling**
4. **Database connection caching**
5. **Health check endpoints**

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables - Production first, then fallback
dotenv.config({ path: path.join(process.cwd(), '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  process.env.CLIENT_URL,
  'https://rk.vercel.app',
  'https://rk-backend.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database Connection
let mongooseConnected = false;

async function connectDatabase() {
  if (mongooseConnected) return;
  
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/rk-backend',
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2
      }
    );
    mongooseConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    throw error;
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
  });
});

// Routes (Import from server/routes)
import authRoutes from '../server/routes/auth.js';
import orderRoutes from '../server/routes/order.js';
import userRoutes from '../server/routes/user.js';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
// Add other routes...

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// VERCEL EXPORT (Required - don't listen on port)
export default app;

// LOCAL DEVELOPMENT ONLY
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
```

---

## Phase 4: Deployment to Vercel

### Step 4.1: Commit All Changes

```bash
cd RK-backend

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "feat: Prepare backend for Vercel deployment

- Converted to Vercel serverless structure
- Updated package.json with start script
- Created vercel.json configuration
- Added .env.production template
- Updated api/index.js for serverless
- Added health check endpoints"

# Push
git push origin main
```

### Step 4.2: Connect to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select: `sivasuriya2k3-creator/Rk-backend`
5. Click **"Import"**

**Option B: Via Vercel CLI**

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Or link to existing project
vercel link
```

### Step 4.3: Configure Environment Variables

In **Vercel Dashboard**:

1. Go to **Project Settings → Environment Variables**
2. Add for **Production, Preview, Development**:

```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
CLIENT_URL = https://your-frontend.com
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
NODE_ENV = production
```

3. Click **"Save"**

### Step 4.4: Trigger Deployment

```bash
# Push any change to main
git add .
git commit -m "trigger deployment"
git push origin main
```

**Or manually:**
1. Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment

---

## Phase 5: Testing

### Step 5.1: Test Health Endpoint

```bash
# Get your Vercel URL (e.g., https://rk-backend-xxx.vercel.app)

# Test health
curl https://rk-backend-xxx.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-24T10:30:00.000Z",
  "environment": "production",
  "uptime": 123.45,
  "memory": "45MB"
}
```

### Step 5.2: Test API Endpoints

```bash
# Test authentication
curl -X POST https://rk-backend-xxx.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Test orders
curl https://rk-backend-xxx.vercel.app/api/orders

# Test users
curl https://rk-backend-xxx.vercel.app/api/users
```

### Step 5.3: Check Logs

```bash
# Real-time logs
vercel logs rk-backend --follow

# Or in dashboard: Deployments → Select → Logs
```

---

## Phase 6: Common Issues & Solutions

### ❌ Error: "Cannot find module"

**Solution:**
```bash
npm install
vercel env pull
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### ❌ Error: "504 Gateway Timeout"

**Solution in vercel.json:**
```json
"functions": {
  "api/index.js": {
    "maxDuration": 60,
    "memory": 1024
  }
}
```

### ❌ Error: "CORS blocked"

**Solution in api/index.js:**
```javascript
const allowedOrigins = [
  'https://your-frontend-domain.com',  // Add your domain
  'https://rk.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### ❌ Error: "No port is open"

**Solution:** Remove `app.listen()` in production
```javascript
// ❌ WRONG
app.listen(3000);

// ✅ RIGHT
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
}
export default app;
```

### ❌ Error: "Cannot connect to MongoDB"

**Solution:**
1. MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`
2. Verify connection string in `.env.production`
3. Test locally: `node -e "import('./api/index.js')"`

---

## Phase 7: Production Checklist

```
✅ Setup
  ☐ Moved code to api/ folder
  ☐ Updated package.json with "start" script
  ☐ Created vercel.json
  ☐ Created .env.production (not committed)
  ☐ Removed app.listen() for production

✅ GitHub
  ☐ Committed all changes
  ☐ Pushed to main branch
  ☐ No sensitive data in commits

✅ Vercel
  ☐ Created Vercel account
  ☐ Imported GitHub repo
  ☐ Added environment variables
  ☐ Deployment successful (no errors)

✅ Testing
  ☐ Health endpoint responds
  ☐ API endpoints working
  ☐ Database connected
  ☐ CORS configured
  ☐ Authentication working

✅ Monitoring
  ☐ Vercel logs checked
  ☐ Performance metrics reviewed
```

---

## Quick Commands Reference

```bash
# Local Testing
npm install
npm run dev
curl http://localhost:5002/api/health

# Deploy to Vercel
git add .
git commit -m "Deploy"
git push origin main

# Check Vercel Status
vercel status
vercel logs --follow

# Rollback
vercel rollback
```

---

## Vercel URL Format

After deployment, your API URL will be:

```
https://rk-backend.vercel.app
```

Or with custom domain:
```
https://api.yourdomain.com
```

Update your frontend `.env`:
```
VITE_API_URL=https://rk-backend.vercel.app
```

---

**Status:** Ready for Deployment ✅
**Last Updated:** January 24, 2026
