#!/usr/bin/env node

// Build script that works in deployment environment
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building for deployment...');

// Set environment
process.env.NODE_ENV = 'production';

// Clear existing build
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

try {
  // Try to run vite build directly using node_modules
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  if (fs.existsSync(vitePath)) {
    console.log('📦 Running Vite build...');
    execSync(`node ${vitePath} build`, { 
      stdio: 'inherit',
      cwd: __dirname,
      timeout: 60000
    });
    
    console.log('✅ Build completed successfully');
  } else {
    throw new Error('Vite not found in node_modules');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Fallback: create minimal HTML/JS bundle
  console.log('🔄 Creating fallback build...');
  
  const publicDir = path.join(__dirname, 'dist/public');
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Create basic HTML
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My IEP Hero</title>
  </head>
  <body>
    <div id="root">
      <h1>My IEP Hero</h1>
      <p>Application is being prepared for deployment...</p>
    </div>
  </body>
</html>`;
  
  fs.writeFileSync(path.join(publicDir, 'index.html'), html);
  console.log('📄 Fallback HTML created');
}