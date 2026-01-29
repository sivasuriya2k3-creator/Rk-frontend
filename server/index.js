// ============================================
// BOOT SEQUENCE - RENDER PORT BINDING FIRST
// ============================================
console.log('\n🚀 BOOT FILE RUNNING');
console.log('📍 PORT FROM RENDER:', process.env.PORT);
console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'not set');

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

// Create app IMMEDIATELY
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// SETUP BASIC MIDDLEWARE (BEFORE LISTEN)
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5002',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://rk-website-frontend.onrender.com'
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Health check route (INSTANT, no dependencies)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

// ============================================
// LISTEN TO PORT FIRST - RENDER REQUIREMENT
// ============================================
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ SERVER LISTENING ON PORT ${PORT}`);
  console.log(`✅ Binding address: 0.0.0.0`);
  console.log(`✅ Server is ready to receive requests\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ PORT ${PORT} IS ALREADY IN USE`);
  } else {
    console.error('❌ SERVER ERROR:', err.message);
  }
  process.exit(1);
});

// ============================================
// SETUP DATABASE (NON-BLOCKING)
// ============================================
const MONGODB_URI = process.env.MONGODB_URI;
let mongoConnection = null;

const connectMongo = async () => {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set - skipping DB connection');
    return null;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });
    mongoConnection = mongoose.connection;
    console.log('✅ MongoDB connected');
    return mongoConnection;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    return null;
  }
};

// Connect MongoDB in background (async, non-blocking)
connectMongo().catch(err => console.warn('⚠️  DB error:', err.message));

// Middleware to ensure DB for each request
let mongoInitialized = false;
app.use(async (req, res, next) => {
  if (!mongoInitialized && MONGODB_URI) {
    try {
      await connectMongo();
      mongoInitialized = true;
    } catch (err) {
      console.warn('⚠️  MongoDB not available for this request');
    }
  }
  next();
});

// ============================================
// SETUP ROUTES (IN BACKGROUND)
// ============================================
async function setupRoutes() {
  try {
    console.log('📦 Loading routes...');
    
    const { default: authRoutes } = await import('./routes/auth.js');
    const { default: portfolioRoutes } = await import('./routes/portfolio.js');
    const { default: contactRoutes } = await import('./routes/contact.js');
    const { default: orderRoutes } = await import('./routes/order.js');
    const { default: brandingIdentityRoutes } = await import('./routes/brandingIdentity.js');
    const { default: webProjectRoutes } = await import('./routes/webProject.js');
    const { default: animation3DRoutes } = await import('./routes/animation3D.js');
    const { default: uiuxProjectRoutes } = await import('./routes/uiuxProject.js');
    const { default: employeeRoutes } = await import('./routes/employee.js');
    const { default: projectRoutes } = await import('./routes/project.js');
    const { default: userRoutes } = await import('./routes/user.js');
    const { default: revenueRoutes } = await import('./routes/revenue.js');
    const { default: uploadRoutes } = await import('./routes/upload.js');
    const { default: applicationRoutes } = await import('./routes/applicationRoutes.js');
    const { default: dnsRoutes } = await import('./routes/dns.js');
    const { default: chatbotRoutes } = await import('./routes/chatbot.js');
    const { default: otpRoutes } = await import('./routes/otp.js');
    const { default: configRoutes } = await import('./routes/config.js');

    // Static files
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
    app.use(express.static(path.join(__dirname, '../dist')));

    // API Routes
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

    // Error handler
    app.use((err, req, res, next) => {
      console.error('API Error:', err.message);
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    });

    // SPA fallback - serve index.html for all non-API routes (MUST be last)
    app.get('*', (req, res) => {
      const indexPath = path.join(__dirname, '../dist/index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(404).json({ error: 'Not found' });
        }
      });
    });

    console.log('✅ Routes loaded successfully\n');
  } catch (err) {
    console.error('❌ Error loading routes:', err.message);
  }
}

// Load routes in background
setupRoutes();

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    if (mongoConnection) {
      mongoose.disconnect();
    }
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// ============================================
// VERCEL EXPORT (for Vercel deployment)
// ============================================
export default app;
