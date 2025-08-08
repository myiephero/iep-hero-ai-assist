import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupDemoAccounts } from "./demo-setup";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Setup demo accounts - wrapped with comprehensive error handling for deployment
  try {
    // Add timeout to prevent hanging during deployment
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Demo setup timeout')), 10000)
    );
    
    await Promise.race([setupDemoAccounts(), timeoutPromise]);
    console.log("✅ Demo accounts setup completed successfully");
  } catch (error: any) {
    console.error("⚠️ Demo account setup failed, but continuing with server startup:", error.message);
    
    // Enhanced error logging for deployment debugging
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.stack && process.env.NODE_ENV !== 'production') {
      console.error("Stack trace:", error.stack);
    }
    
    // Log environment for deployment troubleshooting
    console.log("🔧 Environment info:", {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      PORT: process.env.PORT || 'Using default 5000'
    });
    
    // Continue with server startup - demo setup failure should not prevent deployment
    console.log("🚀 Proceeding with server startup despite demo setup failure");
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = '0.0.0.0'; // Always bind to all interfaces for Cloud Run deployment
  
  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    log(`🚀 Server ready and serving on ${host}:${port}`);
    log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`📁 Static files: ${app.get('env') === 'development' ? 'Vite dev server' : 'Production build'}`);
  }).on('error', (err: any) => {
    console.error('❌ Server failed to start:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please try a different port.`);
    } else if (err.code === 'EACCES') {
      console.error(`Permission denied to bind to port ${port}. Try running with sudo or use a port > 1024.`);
    }
    console.error('Full error:', err);
    process.exit(1);
  });
})();
