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
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB error:', err));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
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

// ✅ REQUIRED FOR VERCEL
export default app;
