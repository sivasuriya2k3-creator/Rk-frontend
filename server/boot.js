// ============================================
// DIAGNOSTIC BOOT FILE - RENDER PORT BINDING
// ============================================

// Step 1: Prove file is running
console.log('\n========================================');
console.log('🚀 BOOT FILE STARTED');
console.log('========================================');
console.log('Time:', new Date().toISOString());
console.log('Process ID:', process.pid);
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Step 2: Check environment variables
console.log('\n📋 ENVIRONMENT VARIABLES:');
console.log('  PORT =', process.env.PORT || '❌ NOT SET - USING DEFAULT 10000');
console.log('  NODE_ENV =', process.env.NODE_ENV || 'not set');

// Step 3: Get PORT - must use process.env.PORT if available
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
console.log(`\n✅ Using PORT: ${PORT}`);

// Step 4: Import Express (synchronous)
console.log('\n📦 Importing Express...');
import express from 'express';

const app = express();

// Step 5: Add minimal routes
console.log('📝 Adding routes...');
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});
console.log('✅ Routes added');

// Step 6: Bind to port
console.log('\n🔗 Binding to 0.0.0.0:' + PORT);
console.log('   Address: 0.0.0.0 (all interfaces)');

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('✅✅✅ SERVER IS LISTENING ✅✅✅');
  console.log('========================================');
  console.log('Port: ' + PORT);
  console.log('Address: 0.0.0.0');
  console.log('Status: READY');
  console.log('========================================\n');
});

server.on('error', (err) => {
  console.error('\n❌ BINDING ERROR:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' is already in use');
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => process.exit(0));
});
