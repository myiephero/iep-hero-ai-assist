#!/usr/bin/env node

console.log("🚀 Starting IEP Advocacy Platform Deployment...");

// Set production environment
process.env.NODE_ENV = 'production';

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

console.log('✅ Cloud Run deployment environment configured');
console.log(`🔧 Host binding: 0.0.0.0 (Cloud Run compatible)`);
console.log(`📊 Deployment mode: ${process.env.REPLIT_DEPLOYMENT ? 'Replit Autoscale' : 'Standard'}`);

// Start the production server using tsx
const { spawn } = require('child_process');

const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('❌ Failed to start production server:', error);
  console.error('🔍 Debug info: Port configuration may be incorrect for Cloud Run');
  console.error('💡 Ensure server binds to 0.0.0.0 and uses PORT environment variable');
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Production server exited with code ${code}`);
  process.exit(code);
});