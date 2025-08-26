#!/usr/bin/env node

// Deployment build that bypasses npm issues completely
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Deployment Build System - Bypassing npm issues...');

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