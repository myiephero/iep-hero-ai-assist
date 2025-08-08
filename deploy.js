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

// Verify required environment variables
const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required environment variables present');

// Start the production server using server/index.ts
const { spawn } = require('child_process');

const server = spawn('node', ['server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('❌ Failed to start production server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Production server exited with code ${code}`);
  process.exit(code);
});