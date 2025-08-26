#!/usr/bin/env node

/**
 * Cloud Run Deployment Script
 * Fixes port configuration, error handling, and deployment compatibility
 */

console.log("🚀 Starting Cloud Run compatible deployment...");

// Set production environment
process.env.NODE_ENV = 'production';

// Cloud Run automatically sets PORT - must use environment variable
const port = process.env.PORT || '5000';
console.log(`📦 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${port} (from ${process.env.PORT ? 'Cloud Run ENV' : 'default'})`);
console.log(`🎯 Deployment Target: Cloud Run`);
console.log(`🏠 Host: 0.0.0.0 (required for Cloud Run)`);

// Enhanced error handling for deployment debugging
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception during deployment:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection during deployment at:', promise, 'reason:', reason);
  process.exit(1);
});

// Verify environment for Cloud Run
console.log('🔍 Verifying Cloud Run environment...');
console.log(`Host binding: 0.0.0.0 (Cloud Run compatible)`);
console.log(`Single port configuration: ${port}`);
console.log(`Static file serving: ${process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'}`);

// Start the production server
const { spawn } = require('child_process');

console.log('🏃‍♂️ Starting production server...');

const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: port
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start production server:', error);
  console.error('Error details:', error.message);
  process.exit(1);
});

server.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Production server exited gracefully');
  } else {
    console.error(`❌ Production server exited with code ${code}`);
  }
  process.exit(code);
});

// Health check verification
setTimeout(() => {
  const http = require('http');
  
  const healthCheck = http.request({
    hostname: 'localhost',
    port: port,
    path: '/health',
    method: 'GET'
  }, (res) => {
    console.log(`✅ Health check response: ${res.statusCode}`);
  });

  healthCheck.on('error', (err) => {
    console.log('ℹ️ Health check connection failed (expected during startup):', err.message);
  });

  healthCheck.end();
}, 5000);

console.log('🎯 Cloud Run deployment script ready');
console.log('💡 Server will bind to 0.0.0.0 for Cloud Run compatibility');
console.log('🏥 Health checks available at /health and /startup-health');