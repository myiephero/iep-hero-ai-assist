import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting IEP Advocacy Platform...");

// Use PORT environment variable for deployment compatibility
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

console.log(`📍 Using port: ${port}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

if (isProduction) {
  // Production mode: serve built files
  console.log("⚡ Starting production server...");
  
  const app = express();
  
  // Serve static files from dist/public
  app.use(express.static(path.join(__dirname, '../dist/public')));
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      port: port,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });
  
  // Catch-all route to serve index.html for SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
  
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Production server running on port ${port}`);
    console.log(`🔗 Health Check: http://0.0.0.0:${port}/api/health`);
  });
  
  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
  
} else {
  // Development mode: start Vite
  console.log("🔧 Starting development server...");
  
  const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', port.toString()], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  vite.on('error', (error) => {
    console.error('❌ Failed to start Vite:', error);
    process.exit(1);
  });
  
  vite.on('close', (code) => {
    console.log(`Vite process exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });
}
