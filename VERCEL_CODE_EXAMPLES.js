// VERCEL DEPLOYMENT - MINIMAL WORKING CODE EXAMPLES

/**
 * ============================================
 * FILE: api/index.js - Vercel Entry Point
 * ============================================
 * 
 * This is the main file Vercel will use.
 * It replaces server/index.js for Vercel deployment.
 */

// ===== IMPORTS =====
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== ENVIRONMENT SETUP =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
// Priority: .env.production (Vercel) → .env (local) → defaults
dotenv.config({ path: path.join(process.cwd(), '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('[STARTUP]', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET',
  CLIENT_URL: process.env.CLIENT_URL
});

// ===== EXPRESS APP INITIALIZATION =====
const app = express();

// ===== GLOBAL MIDDLEWARE =====

// Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS - Production Configuration
const allowedOrigins = [
  // Local Development
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://192.168.1.3:8081',
  'http://172.17.7.107:8081',
  // Environment Variable
  process.env.CLIENT_URL,
  // Vercel
  'https://rk.vercel.app',
  'https://rk-backend.vercel.app'
].filter(Boolean); // Remove undefined values

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}));

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// ===== DATABASE CONNECTION (WITH CACHING) =====
let mongooseConnected = false;

/**
 * Connect to MongoDB with connection caching
 * Vercel serverless functions can reuse connections across invocations
 */
async function connectDatabase() {
  // Check if already connected
  if (mongooseConnected) {
    console.log('[DB] Using cached connection');
    return;
  }

  // Check Mongoose connection state
  if (mongoose.connection.readyState === 1) {
    mongooseConnected = true;
    console.log('[DB] Reusing existing connection');
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not set in environment variables');
    }

    console.log('[DB] Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI, {
      // Connection timeouts
      serverSelectionTimeoutMS: 5000,   // 5 seconds to find server
      socketTimeoutMS: 45000,            // 45 seconds for queries
      connectTimeoutMS: 10000,           // 10 seconds to connect
      
      // Connection pooling
      maxPoolSize: 10,                   // Max concurrent connections
      minPoolSize: 2,                    // Min concurrent connections
      
      // Retry strategy
      retryWrites: true,
      retryReads: true
    });

    mongooseConnected = true;
    console.log('[DB] ✅ MongoDB connected successfully');
  } catch (error) {
    console.error('[DB] ❌ Connection error:', error.message);
    mongooseConnected = false;
    throw error;
  }
}

// ===== HELPER: Ensure Database Before Operations =====
async function ensureDatabase() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('[DB] Failed to connect:', error.message);
    throw new Error('Database connection failed');
  }
}

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'RK Backend API - Vercel Deployment',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      database: '/api/health/db'
    },
    documentation: 'https://github.com/sivasuriya2k3-creator/Rk-backend'
  });
});

// ===== HEALTH CHECK ENDPOINTS =====

/**
 * Basic health check - No database required
 */
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.round(uptime * 100) / 100,
    memory: {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + ' MB'
    },
    database: mongooseConnected ? 'connected' : 'disconnected',
    version: '1.0.0'
  });
});

/**
 * Database health check
 */
app.get('/api/health/db', async (req, res) => {
  try {
    await ensureDatabase();

    // Ping the database
    const adminDb = mongoose.connection.db.admin();
    const status = await adminDb.ping();

    res.status(200).json({
      status: 'ok',
      database: 'MongoDB connected',
      ping: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ===== SAMPLE ROUTES =====

/**
 * Example Route: Authentication
 * 
 * Before uncommenting, ensure:
 * 1. authRoutes is created in server/routes/auth.js
 * 2. Auth models and controllers exist
 */

// import authRoutes from '../server/routes/auth.js';
// app.use('/api/auth', authRoutes);

// Placeholder for now
app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    message: 'Login route - Configure in api/index.js',
    note: 'Uncomment routes section to enable'
  });
});

/**
 * Example Route: Orders
 */

// import orderRoutes from '../server/routes/order.js';
// app.use('/api/orders', orderRoutes);

// Placeholder
app.get('/api/orders', (req, res) => {
  res.status(200).json({
    message: 'Orders route - Configure in api/index.js',
    note: 'Uncomment routes section to enable'
  });
});

/**
 * Example Route: Users
 */

// import userRoutes from '../server/routes/user.js';
// app.use('/api/users', userRoutes);

// Placeholder
app.get('/api/users', (req, res) => {
  res.status(200).json({
    message: 'Users route - Configure in api/index.js',
    note: 'Uncomment routes section to enable'
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====

/**
 * Global error handler
 * Must be last middleware
 */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  console.error('[ERROR]', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.path,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

/**
 * 404 Handler
 * Must be after all routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/health/db',
      'POST /api/auth/login',
      'GET /api/orders',
      'GET /api/users'
    ],
    timestamp: new Date().toISOString()
  });
});

// ===== VERCEL EXPORT (CRITICAL) =====
/**
 * IMPORTANT: Vercel calls this for every request
 * This replaces app.listen() on Vercel
 */
export default app;

// ===== LOCAL DEVELOPMENT SUPPORT =====
/**
 * Only listen on port for local development
 * Vercel ignores this and uses the export instead
 */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 RK Backend API - Development Mode    ║
║                                            ║
║   Server: http://localhost:${PORT}                ║
║   Health: http://localhost:${PORT}/api/health    ║
║   Database: http://localhost:${PORT}/api/health/db
║                                            ║
║   NODE_ENV: ${process.env.NODE_ENV}                    ║
║   Database: ${process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET'}           ║
║                                            ║
║   Press Ctrl+C to stop                    ║
║                                            ║
╚════════════════════════════════════════════╝
    `);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[SHUTDOWN] SIGINT received');
  mongoose.connection.close();
  process.exit(0);
});


// ===== TESTING EXAMPLES =====

/**
 * Test these endpoints after deployment:
 * 
 * 1. Health Check (No auth needed)
 *    curl https://rk-backend.vercel.app/api/health
 *    
 * 2. Database Health Check
 *    curl https://rk-backend.vercel.app/api/health/db
 *    
 * 3. Login (Once configured)
 *    curl -X POST https://rk-backend.vercel.app/api/auth/login \
 *      -H "Content-Type: application/json" \
 *      -d '{"email":"test@test.com","password":"pass123"}'
 *    
 * 4. Get Orders (Once configured)
 *    curl https://rk-backend.vercel.app/api/orders
 *    
 * 5. From Browser (CORS test)
 *    fetch('https://rk-backend.vercel.app/api/health')
 *      .then(r => r.json())
 *      .then(console.log)
 */
