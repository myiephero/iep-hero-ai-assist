import express from "express";
import { json } from "body-parser";
import path from "path";

const app = express();

// Parse JSON bodies
app.use(json());

// Enhanced logging for Cloud Run debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint for Cloud Run
app.get('/health', (_, res) => {
  const health = {
    ok: true,
    service: "api",
    buildId: process.env.REPLIT_DEPLOYMENT ? "production" : "dev",
    time: new Date().toISOString(),
    port: process.env.PORT || "5000",
    environment: process.env.NODE_ENV || "development",
    deployment: process.env.REPLIT_DEPLOYMENT ? "Replit Autoscale" : "Development"
  };
  console.log(`Health check requested: ${JSON.stringify(health)}`);
  res.status(200).json(health);
});

// Enhanced health check with more details for Cloud Run debugging
app.get('/startup-health', (req, res) => {
  const startupInfo = {
    status: 'OK',
    message: 'Server startup successful',
    port: parseInt(process.env.PORT || "5000", 10),
    host: "0.0.0.0",
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.REPLIT_DEPLOYMENT ? 'Replit Autoscale' : 'Development',
    timestamp: new Date().toISOString(),
    deploymentConfig: {
      isAutoscale: !!process.env.REPLIT_DEPLOYMENT,
      hasPortEnv: !!process.env.PORT,
      listeningOn: `0.0.0.0:${process.env.PORT || "5000"}`
    }
  };
  console.log(`Startup health check: ${JSON.stringify(startupInfo)}`);
  res.json(startupInfo);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(process.cwd(), 'dist', 'public');
  console.log(`Serving static files from: ${publicPath}`);
  app.use(express.static(publicPath));
  
  // SPA fallback for frontend routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`Server error: ${error.message}`, error.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    timestamp: new Date().toISOString()
  });
});

// Port configuration for Cloud Run compatibility
const port = parseInt(process.env.PORT || "5000", 10);
const host = "0.0.0.0"; // Bind to all interfaces for Cloud Run

// Enhanced server startup with error handling
const server = app.listen(port, host, () => {
  console.log(`✅ Server started successfully`);
  console.log(`📍 Listening on http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Deployment: ${process.env.REPLIT_DEPLOYMENT ? 'Replit Autoscale' : 'Development'}`);
  console.log(`💚 Health check available at /health and /startup-health`);
});

// Graceful shutdown for Cloud Run
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📥 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
