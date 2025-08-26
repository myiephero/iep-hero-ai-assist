#!/usr/bin/env node

// Deployment build that ensures Node.js is available and uses reliable build system
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Deployment Build System - Ensuring Node.js runtime is available...');

// Ensure Node.js is available in PATH
process.env.PATH = '/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:' + process.env.PATH;

// Verify Node.js is available
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js not found in PATH');
  process.exit(1);
}

try {
  // Use our working build wrapper that bypasses all npm/Vite problems
  if (fs.existsSync('./build-wrapper.sh')) {
    console.log('📦 Using reliable ESBuild system...');
    execSync('chmod +x ./build-wrapper.sh && ./build-wrapper.sh', { stdio: 'inherit' });
    
    // Verify the build succeeded
    const distPath = path.join(__dirname, 'dist/public/index.html');
    if (fs.existsSync(distPath)) {
      console.log('✅ Build completed successfully!');
      
      // Show what was built
      const stats = fs.readdirSync(path.join(__dirname, 'dist/public'));
      console.log('📊 Built files:');
      stats.forEach(file => {
        const filePath = path.join(__dirname, 'dist/public', file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          console.log(`  ✓ ${file} (${Math.round(stat.size / 1024)}KB)`);
        } else {
          console.log(`  ✓ ${file}/ (directory)`);
        }
      });
      
      process.exit(0);
    } else {
      throw new Error('Build wrapper completed but no files generated');
    }
  } else {
    throw new Error('build-wrapper.sh not found - fallback build needed');
  }

} catch (error) {
  console.error('❌ Deployment build failed:', error.message);
  console.error('This is likely due to npm not being available in the deployment environment.');
  console.error('The application requires the build-wrapper.sh script to work around this issue.');
  process.exit(1);
}