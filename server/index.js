import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/golden-creative-hub';

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:5173',
  'http://192.168.1.3:8081',
  'http://172.17.7.107:8081',
  'http://172.17.7.107:8082',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and local network IPs
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.') || origin.includes('172.')) {
      // Allow any local network IP
      console.log('Allowing local network origin:', origin);
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow all origins for now during development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    // Don't exit on MongoDB connection error for testing
    // process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`✓ MongoDB URI: ${MONGODB_URI}`);
  console.log(`✓ Server started at ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('✗ Server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
