console.log("🔥 MINIMAL SERVER STARTING");

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("📦 Express imported successfully");

const app = express();

console.log("🔧 Setting up basic routes...");

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Simple API route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Minimal server is working' });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const port = parseInt(process.env.PORT || '5000', 10);

console.log(`🚀 Starting server on port ${port}...`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Minimal server successfully running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});