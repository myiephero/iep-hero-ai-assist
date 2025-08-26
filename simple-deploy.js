#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

console.log('🚀 Simple deployment server starting...');

const port = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'dist/public');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      ok: true,
      service: 'iep-advocacy-platform',
      time: new Date().toISOString(),
      port: port,
      environment: 'production'
    }));
    return;
  }
  
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html for SPA routes
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  let filePath = path.join(distPath, pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html for SPA routing
      filePath = path.join(distPath, 'index.html');
    }
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>Build files missing. Please build the application first.</p>');
        return;
      }
      
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ IEP Advocacy Platform deployed successfully`);
  console.log(`🌐 Server running on http://0.0.0.0:${port}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log(`🏥 Health check: http://0.0.0.0:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});