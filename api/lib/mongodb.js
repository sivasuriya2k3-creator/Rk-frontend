/**
 * MongoDB Connection Module for Vercel Serverless
 * 
 * Usage:
 * import { connectDB } from './lib/mongodb.js';
 * const db = await connectDB();
 */

import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  // If we already have a connection, return it
  // (This is important for serverless to reuse connections)
  if (cachedConnection && cachedConnection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Get MongoDB URI from environment variables
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      throw new Error(
        '❌ MONGODB_URI is not defined in environment variables. ' +
        'Please set it in your .env.local or Vercel Environment Variables.'
      );
    }

    console.log('🔄 Connecting to MongoDB...');

    // Connect to MongoDB
    const connection = await mongoose.connect(mongodbUri, {
      // Options for connection
      serverSelectionTimeoutMS: 30000,  // Increased from 5s to 30s for cloud connections
      socketTimeoutMS: 45000,
      maxPoolSize: 10,  // Connection pooling for serverless
      minPoolSize: 2,   // Keep minimum connections alive
      maxIdleTimeMS: 30000,  // Close idle connections after 30s
      retryWrites: true,  // Retry writes on failure
      w: 'majority',  // Wait for majority of replicas
    });

    cachedConnection = connection;
    console.log('✅ Connected to MongoDB successfully');

    return connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * Use this when needed (not typically in serverless)
 */
export async function disconnectDB() {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('✅ Disconnected from MongoDB');
  }
}

/**
 * Get current connection status
 */
export function getConnectionStatus() {
  if (!cachedConnection) {
    return 'Not connected';
  }

  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  return states[cachedConnection.readyState] || 'Unknown';
}
