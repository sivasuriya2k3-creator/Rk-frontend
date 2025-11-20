#!/usr/bin/env node

/**
 * Setup Script - Run this to quickly set up your environment
 * Usage: node setup.js
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🚀 Golden Creative Hub - Setup Script\n');
  
  // Check if .env exists
  if (fs.existsSync('.env')) {
    console.log('✓ .env file already exists');
    rl.close();
    return;
  }

  console.log('Let\'s set up your environment variables!\n');

  // MongoDB Setup
  console.log('📦 MongoDB Setup:');
  console.log('Choose your MongoDB setup:');
  console.log('1. Local MongoDB (mongodb://localhost:27017)');
  console.log('2. MongoDB Atlas (Cloud)\n');
  
  const mongoChoice = await question('Enter your choice (1 or 2): ');
  
  let mongoUri = 'mongodb://localhost:27017/golden-creative-hub';
  
  if (mongoChoice === '2') {
    mongoUri = await question('Enter your MongoDB Atlas connection string: ');
  }

  // JWT Setup
  console.log('\n🔐 JWT Configuration:');
  const jwtSecret = await question('Enter a JWT secret (or press Enter for default): ') || 'your_jwt_secret_key_change_in_production';
  const jwtExpire = await question('Enter token expiration time (default: 7d): ') || '7d';

  // Port Configuration
  console.log('\n🔌 Server Configuration:');
  const port = await question('Enter server port (default: 5000): ') || '5000';
  const clientUrl = await question('Enter frontend URL (default: http://localhost:5173): ') || 'http://localhost:5173';

  // Create .env file
  const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# Database Configuration
MONGODB_URI=${mongoUri}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=${jwtExpire}

# Client Configuration
CLIENT_URL=${clientUrl}

# Additional Settings
LOG_LEVEL=debug
`;

  try {
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ .env file created successfully!\n');
    console.log('Configuration:');
    console.log(`  • MongoDB: ${mongoUri}`);
    console.log(`  • Server Port: ${port}`);
    console.log(`  • Client URL: ${clientUrl}`);
    console.log(`  • Token Expiry: ${jwtExpire}\n`);
    console.log('📝 Note: Keep your JWT_SECRET safe in production!\n');
    console.log('Next steps:');
    console.log('  1. npm install');
    console.log('  2. npm run server:dev (terminal 1)');
    console.log('  3. npm run dev (terminal 2)\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

setup().catch(console.error);
