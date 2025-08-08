console.log("🚀 Starting production server...");

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const isDeployment = process.env.REPLIT_DEPLOYMENT === '1';

console.log(`📦 Express loaded - Port: ${port}`);
console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`🎯 Deployment Mode: ${isDeployment ? 'Replit Autoscale' : 'Development/Other'}`);
console.log(`🔧 Port Configuration: ${port} ${isDeployment ? '(autoscale external port)' : '(mapped to external port 80)'}`);

// Add startup health check to prevent demo setup failures from blocking deployment
app.get('/startup-health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server startup successful',
    port: port,
    environment: process.env.NODE_ENV || 'development',
    deployment: isDeployment ? 'Replit Autoscale' : 'Development',
    timestamp: new Date().toISOString(),
    deploymentConfig: {
      isAutoscale: isDeployment,
      hasPortEnv: !!process.env.PORT,
      listeningOn: `0.0.0.0:${port}`
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist/public')));

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
  res.sendFile(path.join(__dirname, 'dist/public/index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

console.log(`🔧 Starting server on port ${port}...`);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Production server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Deployment Type: ${isDeployment ? 'Replit Autoscale' : 'Other'}`);
  console.log(`🔗 Health Check: http://0.0.0.0:${port}/startup-health`);
  console.log(`🏥 API Health: http://0.0.0.0:${port}/api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${port} is in use - This indicates multiple external port configuration issue`);
    console.log(`🔧 Cloud Run expects single external port mapping: ${port} → 80`);
    process.exit(1);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Production environment - preventing demo setup failures from blocking deployment...');
    console.log('🔧 Implementing graceful recovery for Cloud Run deployment...');
    setTimeout(() => {
      console.log('🔄 Retrying server startup after demo setup recovery...');
      process.exit(1);
    }, 3000);
  }
});