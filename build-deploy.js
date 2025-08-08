#!/usr/bin/env node

// Custom build script that handles all deployment issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment build...');

try {
  // Step 1: Run pre-build fixes
  console.log('🔧 Running pre-build fixes...');
  execSync('node prebuild.js', { stdio: 'inherit' });

  // Step 2: Verify Vite is available
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    console.log('✅ Vite is available');
  } catch (error) {
    console.log('⚠️ Vite not found, attempting to install...');
    execSync('npm install vite@latest', { stdio: 'inherit' });
  }

  // Step 3: Run build with deployment config
  console.log('🏗️ Building for production...');
  execSync('npx vite build --config vite.config.deploy.js --mode production', { stdio: 'inherit' });

  // Step 4: Fix file structure if needed
  const clientIndexPath = path.join(__dirname, 'dist/public/client/index.html');
  const rootIndexPath = path.join(__dirname, 'dist/public/index.html');
  
  if (fs.existsSync(clientIndexPath) && !fs.existsSync(rootIndexPath)) {
    console.log('📁 Moving index.html to root...');
    fs.renameSync(clientIndexPath, rootIndexPath);
    
    // Remove empty client directory
    try {
      fs.rmdirSync(path.join(__dirname, 'dist/public/client'));
    } catch (err) {
      // Directory might not be empty, that's ok
    }
  }

  // Step 5: Restore HTML file
  const htmlPath = path.join(__dirname, 'client/index.html');
  if (fs.existsSync(htmlPath)) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    if (htmlContent.includes('src="./src/main.tsx"')) {
      htmlContent = htmlContent.replace('src="./src/main.tsx"', 'src="/src/main.tsx"');
      fs.writeFileSync(htmlPath, htmlContent);
      console.log('✅ Restored original HTML');
    }
  }

  // Step 6: Verify output
  if (fs.existsSync(rootIndexPath)) {
    console.log('✅ Build successful!');
    console.log('📊 Build output:');
    const stats = fs.readdirSync(path.join(__dirname, 'dist/public'));
    stats.forEach(file => {
      const filePath = path.join(__dirname, 'dist/public', file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        console.log(`  ${file}: ${Math.round(stat.size / 1024)}KB`);
      } else {
        console.log(`  ${file}/ (directory)`);
      }
    });
  } else {
    console.error('❌ Build failed - no index.html generated');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}