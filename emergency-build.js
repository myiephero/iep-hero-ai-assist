#!/usr/bin/env node

// Emergency build script that bypasses hanging Vite process
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚨 Emergency build starting...');

try {
  // Set environment
  process.env.NODE_ENV = 'production';
  process.env.PATH = '/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:' + process.env.PATH;
  
  // Create dist directory
  const distDir = path.join(__dirname, 'dist/public');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  
  // Try esbuild directly as fallback
  console.log('📦 Attempting direct esbuild...');
  
  const buildCommand = `npx esbuild client/src/main.tsx --bundle --outdir=dist/public/assets --format=esm --jsx=automatic --minify --platform=browser --target=es2020`;
  
  execSync(buildCommand, { stdio: 'inherit', timeout: 30000 });
  
  // Copy HTML
  const htmlSource = path.join(__dirname, 'client/index.html');
  const htmlDest = path.join(distDir, 'index.html');
  
  let htmlContent = fs.readFileSync(htmlSource, 'utf8');
  // Fix the script tag to point to bundled file
  htmlContent = htmlContent.replace('src="./src/main.tsx"', 'src="./assets/main.js"');
  fs.writeFileSync(htmlDest, htmlContent);
  
  console.log('✅ Emergency build completed');
  
} catch (error) {
  console.error('❌ Emergency build failed:', error.message);
  process.exit(1);
}