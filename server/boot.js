import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.prod') });

const app = express();

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5002",
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  "https://rk-website-frontend.onrender.com"
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server running", timestamp: new Date() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server on 0.0.0.0
const PORT = process.env.PORT || 5002;

console.log(`\n📍 Starting server on port ${PORT}...`);
console.log(`📍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`📍 Binding to: 0.0.0.0:${PORT}\n`);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ SERVER LISTENING ON PORT ${PORT}`);
  console.log(`✅ Binding address: 0.0.0.0`);
  console.log(`✅ Server is ready to receive requests\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ PORT ${PORT} IS ALREADY IN USE`);
  } else {
    console.error("❌ SERVER ERROR:", err.message);
  }
  process.exit(1);
});

// Setup database connection (non-blocking)
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  console.log("🔗 Connecting to MongoDB...");
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      console.log("📊 Database: RK-WEBSITEDB (MongoDB Atlas)");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.warn("⚠️  Server is running but database is unavailable");
      console.warn("🔧 Check MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/database");
    });
} else {
  console.warn("⚠️  MONGODB_URI environment variable not set");
  console.warn("🔧 Server is running but database operations will fail");
}
