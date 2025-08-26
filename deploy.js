#!/usr/bin/env node

// Deployment entry point that ensures Node.js runtime is available
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting deployment...');

// Ensure Node.js is available in PATH for deployment
process.env.PATH = '/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:' + process.env.PATH;

// Ensure we're in the right directory
process.chdir(__dirname);

// Set NODE_ENV for production
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

// Verify Node.js runtime is available for the server
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js runtime for server: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js runtime not available for deployment server');
}

// Create a simple HTTP server using Node.js built-in modules (no Express dependency issues)
const http = require('http');
const url = require('url');
const mime = require('path').extname;

// Serve static files from dist/public
const distPath = path.join(__dirname, 'dist/public');

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  let filePath = path.join(distPath, pathname === '/' ? 'index.html' : pathname);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // For SPA routing, fallback to index.html
    filePath = path.join(distPath, 'index.html');
  }
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    const content = fs.readFileSync(filePath);
    res.end(content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File Not Found</h1>');
  }
});

if (fs.existsSync(distPath)) {
  console.log('📁 Serving built files from:', distPath);
} else {
  console.log('❌ Built files not found at:', distPath);
}

const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 Application available at http://0.0.0.0:${port}`);
});