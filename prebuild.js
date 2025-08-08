#!/usr/bin/env node

// Pre-build script to fix HTML import paths and clear cache
const fs = require('fs');
const path = require('path');

console.log('🔧 Running pre-build fixes...');

// Fix HTML import path
const htmlPath = path.join(__dirname, 'client/index.html');
if (fs.existsSync(htmlPath)) {
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Fix the import path for build
  if (htmlContent.includes('src="/src/main.tsx"')) {
    htmlContent = htmlContent.replace('src="/src/main.tsx"', 'src="./src/main.tsx"');
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Fixed HTML import path');
  }
}

// Clear any problematic cache
const cacheDirectories = [
  'node_modules/.vite',
  'node_modules/.cache',
  '.npm'
];

cacheDirectories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Cleared cache: ${dir}`);
    } catch (err) {
      console.log(`⚠️ Could not clear ${dir}: ${err.message}`);
    }
  }
});

console.log('✅ Pre-build fixes complete');