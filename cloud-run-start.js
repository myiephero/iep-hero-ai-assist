#!/usr/bin/env node

/**
 * Cloud Run Production Start Script
 * Ensures proper port configuration and environment setup for Cloud Run deployment
 */

const { spawn } = require('child_process');

console.log('🚀 Cloud Run Production Startup');
console.log('='.repeat(50));

// Validate Cloud Run environment
const port = process.env.PORT;
if (!port) {
  console.error('❌ ERROR: PORT environment variable not set by Cloud Run');
  console.error('💡 Cloud Run must provide PORT environment variable');
  process.exit(1);
}

console.log(`✅ Port: ${port} (from Cloud Run)`);
console.log(`✅ Host: 0.0.0.0 (Cloud Run compatible)`);
console.log(`✅ Environment: ${process.env.NODE_ENV}`);
console.log(`✅ Deployment: Cloud Run`);

// Enhanced error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Start the server with proper environment
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: port
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (signal) {
    console.log(`🔄 Server terminated by signal: ${signal}`);
  } else {
    console.log(`🔄 Server exited with code: ${code}`);
  }
  process.exit(code || 0);
});

console.log('🎯 Starting production server...');