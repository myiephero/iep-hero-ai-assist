console.log("🔥 PURE JS SERVER STARTING - NO TSX NEEDED");

const express = require('express');
const path = require('path');

console.log("📦 Express imported successfully");

const app = express();

console.log("🔧 Setting up basic routes...");

// Serve static files from client directory
const clientPath = path.join(__dirname, 'client');
console.log(`📁 Looking for client files at: ${clientPath}`);
console.log(`📁 Current directory: ${__dirname}`);
app.use(express.static(clientPath));

// Simple health check
app.get('/api/health', (req, res) => {
  console.log("🏥 Health check requested");
  res.json({ status: 'OK', message: 'Pure JS server working!' });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/index.html');
  console.log(`📄 Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath);
});

const port = parseInt(process.env.PORT || '5000', 10);

console.log(`🚀 Starting pure JS server on port ${port}...`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Pure JS server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});