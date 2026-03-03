#!/usr/bin/env node

/**
 * Environment Variable Validator
 * Throws error during build if required env vars are not set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'NODE_ENV',
  'MODE',
  'CLIENT_URLS',
  'PORT'
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;
const missing = [];
const present = [];

// Check required variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missing.push(envVar);
    hasErrors = true;
  } else {
    present.push(envVar);
  }
}

// Check optional variables (warn but don't fail)
for (const envVar of optionalEnvVars) {
  if (!process.env[envVar]) {
    console.log(`⚠️  Optional: ${envVar} is not set`);
  } else {
    present.push(envVar);
  }
}

// Report status
console.log('\n✅ Configured:');
present.forEach(v => console.log(`   ✓ ${v}`));

if (missing.length > 0) {
  console.log('\n❌ Missing Required:');
  missing.forEach(v => console.log(`   ✗ ${v}`));
  console.log('\n🛑 Build failed! Please set the required environment variables.');
  console.log('   Add them to Vercel Dashboard → Settings → Environment Variables\n');
  process.exit(1);
}

console.log('\n✨ All required environment variables are set!\n');
process.exit(0);