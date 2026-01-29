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
console.log('  PORT =', process.env.PORT || '❌ NOT SET');
console.log('  NODE_ENV =', process.env.NODE_ENV || 'not set');
console.log('  All env keys:', Object.keys(process.env).filter(k => !k.includes('secret')).join(', '));

// Step 3: Validate PORT
if (!process.env.PORT) {
  console.error('\n❌ FATAL: PORT environment variable is not set');
  console.error('Render MUST inject PORT as an environment variable');
  console.error('Expected: PORT=10000 (or similar)');
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);
if (isNaN(PORT)) {
  console.error(`\n❌ FATAL: PORT is not a valid number: ${process.env.PORT}`);
  process.exit(1);
}

console.log(`\n✅ PORT is valid: ${PORT}`);

// Step 4: Import Express
console.log('\n📦 Importing Express...');
try {
  const express = await import('express');
  const app = express.default();
  console.log('✅ Express imported successfully');

  // Step 5: Add minimal routes
  console.log('📝 Adding routes...');
  app.get('/health', (req, res) => {
    console.log('  → Health check request');
    res.json({ 
      status: 'OK', 
      port: PORT,
      timestamp: new Date().toISOString()
    });
  });
  console.log('✅ Routes added');

  // Step 6: Bind to port
  console.log('\n🔗 Attempting to bind Express to 0.0.0.0...');
  console.log(`   Binding to: 0.0.0.0:${PORT}`);
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('✅ SUCCESS - SERVER IS LISTENING');
    console.log('========================================');
    console.log(`🟢 Port: ${PORT}`);
    console.log('🟢 Address: 0.0.0.0');
    console.log('🟢 Status: READY to accept connections');
    console.log('========================================\n');
  });

  server.on('error', (err) => {
    console.error('\n❌ SERVER BINDING FAILED:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is already in use`);
    }
    
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('\n📌 SIGTERM signal received');
    server.close(() => {
      console.log('✅ Server closed gracefully');
      process.exit(0);
    });
  });

} catch (err) {
  console.error('\n❌ FATAL ERROR DURING STARTUP:');
  console.error('Type:', err.constructor.name);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
}
