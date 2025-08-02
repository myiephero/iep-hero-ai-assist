console.log("🚀 Starting server...");

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

console.log("📦 Express loaded");

// Basic route to test server
app.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1>');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

console.log(`🔧 Starting server on port ${port}...`);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err);
  } else {
    console.log(`✅ Server running on port ${port}`);
  }
});