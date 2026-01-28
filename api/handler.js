import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import authRoutes from '../server/routes/auth.js';
import portfolioRoutes from '../server/routes/portfolio.js';
import contactRoutes from '../server/routes/contact.js';
import orderRoutes from '../server/routes/order.js';
import brandingIdentityRoutes from '../server/routes/brandingIdentity.js';
import webProjectRoutes from '../server/routes/webProject.js';
import animation3DRoutes from '../server/routes/animation3D.js';
import uiuxProjectRoutes from '../server/routes/uiuxProject.js';
import employeeRoutes from '../server/routes/employee.js';
import projectRoutes from '../server/routes/project.js';
import userRoutes from '../server/routes/user.js';
import revenueRoutes from '../server/routes/revenue.js';
import uploadRoutes from '../server/routes/upload.js';
import applicationRoutes from '../server/routes/applicationRoutes.js';
import dnsRoutes from '../server/routes/dns.js';
import chatbotRoutes from '../server/routes/chatbot.js';
import otpRoutes from '../server/routes/otp.js';
import configRoutes from '../server/routes/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// MongoDB - Lazy connect for serverless
let mongoConnection = null;

const connectMongo = async () => {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn('⚠ MONGODB_URI not set');
    return null;
  }
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1,
    });
    mongoConnection = mongoose.connection;
    console.log('✓ MongoDB connected');
    return mongoConnection;
  } catch (err) {
    console.error('✗ MongoDB error:', err);
    return null;
  }
};

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB connection on first request
let mongoInitialized = false;
app.use(async (req, res, next) => {
  if (!mongoInitialized) {
    await connectMongo();
    mongoInitialized = true;
  }
  next();
});

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
  res.json({ status: 'OK', message: 'Server running on Vercel' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
