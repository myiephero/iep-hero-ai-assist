console.log("🔥 PURE JS SERVER STARTING - NO TSX NEEDED");

const express = require('express');
const path = require('path');

console.log("📦 Express imported successfully");

const app = express();

console.log("🔧 Setting up basic routes...");

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pure JS server working!' });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const port = parseInt(process.env.PORT || '5000', 10);

console.log(`🚀 Starting pure JS server on port ${port}...`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Pure JS server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});