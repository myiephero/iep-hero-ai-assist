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

// Import and start the production server
require('./server-js.js');