import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Load env first
dotenv.config();

// Ensure environment is set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Catch any top-level errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/order.js';
import brandingIdentityRoutes from './routes/brandingIdentity.js';
import webProjectRoutes from './routes/webProject.js';
import animation3DRoutes from './routes/animation3D.js';
import uiuxProjectRoutes from './routes/uiuxProject.js';
import employeeRoutes from './routes/employee.js';
import projectRoutes from './routes/project.js';
import userRoutes from './routes/user.js';
import revenueRoutes from './routes/revenue.js';
import uploadRoutes from './routes/upload.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dnsRoutes from './routes/dns.js';
import chatbotRoutes from './routes/chatbot.js';
import otpRoutes from './routes/otp.js';
import configRoutes from './routes/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config();

// App
const app = express();

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
let mongoConnection = null;

const connectMongo = async () => {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });
    mongoConnection = mongoose.connection;
    console.log('✓ MongoDB connected');
    return mongoConnection;
  } catch (err) {
    console.error('✗ MongoDB error:', err);
    throw err;
  }
};

// Connect on first request for serverless
let mongoInitialized = false;
app.use(async (req, res, next) => {
  if (!mongoInitialized && MONGODB_URI) {
    try {
      await connectMongo();
      mongoInitialized = true;
    } catch (err) {
      console.error('MongoDB connection failed:', err);
    }
  }
  next();
});

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5002',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://rk-website-frontend.onrender.com' // Render frontend
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/branding', brandingIdentityRoutes);
app.use('/api/web-projects', webProjectRoutes);
app.use('/api/3d-animations', animation3DRoutes);
app.use('/api/uiux-projects', uiuxProjectRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dns', dnsRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/config', configRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// SPA fallback - serve index.html for all non-API routes (MUST be last)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  res.sendFile(indexPath);
});

// ✅ REQUIRED FOR VERCEL
export default app;

// ===================================
// START SERVER – RENDER COMPATIBLE
// ===================================
const PORT = process.env.PORT || 5002;

console.log(`\n📌 Starting server on 0.0.0.0:${PORT}...`);
console.log(`📌 Environment: ${process.env.NODE_ENV}`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server is listening on port ${PORT}`);
  console.log(`✅ Ready to accept connections`);
  
  // Try to connect MongoDB in background (don't block startup)
  if (MONGODB_URI) {
    connectMongo()
      .then(() => console.log('✅ MongoDB connected'))
      .catch(err => console.warn('⚠️  MongoDB not available:', err.message));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});
