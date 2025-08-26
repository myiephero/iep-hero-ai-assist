#!/usr/bin/env node

// Alternative build approach that works around the hanging Vite issue
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting working build process...');

// Set proper environment
process.env.PATH = '/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:' + process.env.PATH;
process.env.NODE_ENV = 'production';

// Clear any existing dist
const distDir = path.join(__dirname, 'dist/public');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Create a working vite config without problematic plugins
const workingConfig = `
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: __dirname,
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html')
    }
  },
  esbuild: {
    jsx: 'automatic'
  }
});
`;

fs.writeFileSync('vite.working.js', workingConfig);

// Run build with timeout and kill if hanging
console.log('📦 Running Vite build with timeout...');

const buildProcess = spawn('npx', ['vite', 'build', '--config', 'vite.working.js'], {
  stdio: 'pipe',
  env: process.env
});

let output = '';
let hasCompleted = false;

buildProcess.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

buildProcess.stderr.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

// Set timeout to kill if hanging
const timeout = setTimeout(() => {
  if (!hasCompleted) {
    console.log('⏰ Build timeout - killing process');
    buildProcess.kill('SIGKILL');
  }
}, 25000);

buildProcess.on('close', (code) => {
  hasCompleted = true;
  clearTimeout(timeout);
  
  if (code === 0) {
    console.log('✅ Build completed successfully');
    
    // Verify output
    if (fs.existsSync(distDir)) {
      console.log('📁 Build output created:', distDir);
      const files = fs.readdirSync(distDir, { recursive: true });
      console.log('📄 Files:', files.length);
      process.exit(0);
    }
  } else {
    console.log(`❌ Build failed with code ${code}`);
    process.exit(1);
  }
});