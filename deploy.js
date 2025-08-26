#!/usr/bin/env node

// Replit Autoscale deployment script with ESM-safe build process

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log("🚀 Starting IEP Advocacy Platform Deployment...");

// First ensure we have a proper build
if (!fs.existsSync('dist/public/index.html')) {
  console.log("🏗️ Build artifacts not found, running production build...");
  
  try {
    // Use our ESM-safe build process
    console.log("🔧 Running ESM-safe production build...");
    execSync('node build-deploy.js', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log("✅ Build completed successfully");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
}

// Set production environment
process.env.NODE_ENV = 'production';
process.env.REPLIT_DEPLOYMENT = '1';

// Ensure PORT is set for autoscale deployment
if (!process.env.PORT) {
  process.env.PORT = '5000';
}

console.log(`📦 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${process.env.PORT}`);
console.log(`🎯 Deployment Target: Replit Autoscale`);

// Verify optional environment variables (don't fail if missing)
const optionalEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
const missingOptionalVars = optionalEnvVars.filter(varName => !process.env[varName]);

if (missingOptionalVars.length > 0) {
  console.warn(`⚠️ Optional environment variables not set: ${missingOptionalVars.join(', ')}`);
  console.log('📝 These may be needed for full functionality but won\'t prevent startup');
}

console.log('✅ Build artifacts verified');
console.log(`🔧 Host binding: 0.0.0.0 (Autoscale compatible)`);
console.log(`📊 Deployment mode: Replit Autoscale`);

// Start the production server using tsx
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('❌ Failed to start production server:', error);
  console.error('🔍 Debug info: Port configuration may be incorrect');
  console.error('💡 Ensure server binds to 0.0.0.0 and uses PORT environment variable');
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Production server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});