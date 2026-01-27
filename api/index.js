/**
 * VERCEL BACKEND ENTRY POINT
 * Main Express server for Vercel serverless deployment

 * 
 * Environment Variables:
 * - PORT: Server port (default: 10000)
 * - MONGODB_URI: MongoDB connection string
 * - NODE_ENV: Environment (production/development)
 * - LOG_LEVEL: Logging level
 * - CORS_ORIGIN: CORS origin setting
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './lib/mongodb.js';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import indexRoute from './routes/index.js';
import healthRoute from './routes/health.js';
import usersRoute from './routes/users.js';
import usersCreateRoute from './routes/users-create.js';
import ordersRoute from './routes/orders.js';
import ordersCreateRoute from './routes/orders-create.js';

// ============================================================
// INITIALIZE EXPRESS APP
// ============================================================

const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// ============================================================
// MIDDLEWARE
// ============================================================

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS middleware
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`;
    console.log(log);
  });
  next();
});

// ============================================================
// STATIC FILE SERVING (DIST FOLDER)
// ============================================================

// Serve static files from dist folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ============================================================
// MIDDLEWARE TO ENSURE DB CONNECTION (BEFORE ROUTES)
// ============================================================

// Ensure database is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTES
// ============================================================

// API Documentation
app.get('/api', indexRoute);

// Health Check
app.get('/api/health', healthRoute);

// Users endpoints
app.get('/api/users', usersRoute);
app.post('/api/users/create', usersCreateRoute);

// Orders endpoints
app.get('/api/orders', ordersRoute);
app.post('/api/orders/create', ordersCreateRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RajKayal Creative Hub API (Vercel)',
    status: 'running',
    environment: NODE_ENV,
    apiDocs: '/api',
    health: '/api/health',
  });
});

// Health check for Vercel
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 404 handler
app.use((req, res) => {
  // Try to serve index.html for SPA routing
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: [
          'GET /api',
          'GET /api/health',
          'GET /api/users',
          'POST /api/users/create',
          'GET /api/orders',
          'POST /api/orders/create',
        ],
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: NODE_ENV === 'development' ? err : {},
  });
});

// ============================================================
// EXPORT FOR VERCEL SERVERLESS
// ============================================================

export default app;
