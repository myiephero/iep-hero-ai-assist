import express from "express";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "OK", 
    port, 
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (_req, res) => {
  res.send("My IEP Hero server is running");
});

// Graceful database connection check (non-blocking)
if (process.env.REPLIT_DEPLOYMENT && process.env.DATABASE_URL) {
  console.log("✅ Database URL configured for deployment");
}

if (process.env.REPLIT_DEPLOYMENT && process.env.SESSION_SECRET) {
  console.log("✅ Session secret configured for deployment");
}

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://0.0.0.0:${port}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
