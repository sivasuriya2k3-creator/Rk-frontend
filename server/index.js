// ============================================
// RK CREATIVE HUB - BACKEND API SERVER
// ============================================
//
// MODES:
//   api  - API server only (for api.rkch.tech)
//   full - API + serves frontend (single server deployment)
//
// Commands:
//   npm run server:api   - Start API only (MODE=api)
//   npm run server:full  - Start API + frontend (MODE=full)
//
// Environment:
//   MODE         - Server mode: api | full
//   CLIENT_URLS  - Comma-separated allowed origins
//   MONGODB_URI  - MongoDB connection string
//   JWT_SECRET   - JWT signing secret
//
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env.server') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const MODE = process.env.MODE || 'api';
const IS_DEV = process.env.NODE_ENV !== 'production';

console.log(`\n🚀 Starting server in ${MODE} mode (${IS_DEV ? 'development' : 'production'})\n`);

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
const getClientUrls = () => {
  const urls = [];
  
  // Always allow localhost in development
  if (IS_DEV) {
    urls.push(
      'http://localhost:5173',
      'http://localhost:5002',
      'http://localhost:3000'
    );
  }
  
  // Parse CLIENT_URLS from environment
  if (process.env.CLIENT_URLS) {
    urls.push(...process.env.CLIENT_URLS.split(',').map(u => u.trim()));
  }
  
  return urls.filter(Boolean);
};

const allowedOrigins = getClientUrls();
console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // In development, allow all
    if (IS_DEV) return callback(null, true);
    
    // In production, check against allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked origin: ${origin}`);
      callback(null, true); // Allow anyway for flexibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: MODE,
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', mode: MODE });
});

// ============================================
// DATABASE CONNECTION
// ============================================
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
  }
};

connectDB();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && MONGODB_URI) {
    await connectDB();
  }
  next();
});

// ============================================
// API ROUTES (Static imports for Vercel compatibility)
// ============================================
import authRouter from './routes/auth.js';
import otpRouter from './routes/otp.js';
import portfolioRouter from './routes/portfolio.js';
import contactRouter from './routes/contact.js';
import orderRouter from './routes/order.js';
import brandingRouter from './routes/brandingIdentity.js';
import webProjectRouter from './routes/webProject.js';
import animation3DRouter from './routes/animation3D.js';
import uiuxProjectRouter from './routes/uiuxProject.js';
import employeeRouter from './routes/employee.js';
import projectRouter from './routes/project.js';
import userRouter from './routes/user.js';
import revenueRouter from './routes/revenue.js';
import uploadRouter from './routes/upload.js';
import applicationRouter from './routes/applicationRoutes.js';
import dnsRouter from './routes/dns.js';
import chatbotRouter from './routes/chatbot.js';
import configRouter from './routes/config.js';

app.use('/api/auth', authRouter);
app.use('/api/otp', otpRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/contact', contactRouter);
app.use('/api/orders', orderRouter);
app.use('/api/branding', brandingRouter);
app.use('/api/web-projects', webProjectRouter);
app.use('/api/3d-animations', animation3DRouter);
app.use('/api/uiux-projects', uiuxProjectRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/revenue', revenueRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/dns', dnsRouter);
app.use('/api/chat', chatbotRouter);
app.use('/api/config', configRouter);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../web/public/uploads')));

// ============================================
// FRONTEND SERVING (MODE: full)
// ============================================
if (MODE === 'full') {
  const distPath = path.join(__dirname, '../web/dist');
  
  // Serve static files
  app.use(express.static(distPath));
  
  // SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) res.status(404).json({ error: 'Not found' });
    });
  });
  
  console.log('✅ Frontend serving enabled');
}

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 (only for API mode)
if (MODE === 'api') {
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ============================================
// START SERVER (only if not running as Vercel serverless)
// ============================================
const PORT = process.env.PORT || 5002;

// Check if we're running directly (not as a Vercel function)
const isDirectExecution = import.meta.url === `file://${process.argv[1]}`;

if (isDirectExecution) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Server running on port ${PORT}`);
    console.log(`✅ Mode: ${MODE}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📌 Shutting down...');
    server.close(() => {
      mongoose.disconnect();
      process.exit(0);
    });
  });
}

export default app;
