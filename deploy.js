#!/usr/bin/env node

// Deployment entry point that handles Node.js path issues
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting deployment...');

// Ensure we're in the right directory
process.chdir(__dirname);

// Set NODE_ENV for production
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

// Create a simple server that serves the built files
const express = require('express');
const app = express();

// Serve static files from dist/public
const distPath = path.join(__dirname, 'dist/public');

if (fs.existsSync(distPath)) {
  console.log('📁 Serving built files from:', distPath);
  app.use(express.static(distPath));
  
  // Handle SPA routing - send index.html for all routes
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Build files not found');
    }
  });
} else {
  console.log('❌ Built files not found at:', distPath);
  app.get('*', (req, res) => {
    res.status(500).send('Application not built. Please run build first.');
  });
}

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 Application available at http://0.0.0.0:${port}`);
});