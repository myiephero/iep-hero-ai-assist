#!/bin/bash

# Enhanced deployment script for fixing npm install and build issues
echo "Starting enhanced deployment build process..."

# Step 1: Clear npm cache and verify package integrity
echo "Clearing npm cache..."
rm -rf .npm || true
rm -rf node_modules/.cache || true

# Step 2: Verify package.json exists and has required fields
echo "Verifying package.json integrity..."
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

# Step 3: Ensure package-lock.json exists for consistent installs
echo "Checking for package-lock.json..."
if [ ! -f "package-lock.json" ]; then
    echo "Generating package-lock.json..."
    npm install --package-lock-only
fi

# Step 4: Clean install to fix dependency resolution
echo "Performing clean dependency install..."
rm -rf node_modules || true
npm ci --verbose || npm install --verbose

# Step 5: Verify Vite is properly installed
echo "Verifying Vite installation..."
if [ ! -f "node_modules/.bin/vite" ] && [ ! -f "node_modules/vite/bin/vite.js" ]; then
    echo "Vite not found, installing explicitly..."
    npm install vite@^5.4.19 --save-dev
fi

# Step 6: Backup original vite config
echo "Backing up vite configuration..."
if [ -f "vite.config.ts" ]; then
    cp vite.config.ts vite.config.ts.backup
fi

# Step 7: Create deployment vite config (CommonJS version without problematic plugins)
echo "Creating deployment-compatible vite configuration..."
cat > vite.config.deployment.js << 'EOF'
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  plugins: [
    // Only include stable, CommonJS-compatible plugins for deployment
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
EOF

# Step 8: Run the build with deployment config
echo "Running build with deployment configuration..."
npx vite build --config vite.config.deployment.js --mode production

# Step 9: Verify build output
echo "Verifying build output..."
if [ -f "dist/public/index.html" ]; then
    echo "✅ Build successful! index.html generated"
    ls -la dist/public/
else
    echo "❌ Build failed! No index.html found"
    exit 1
fi

# Step 10: Cleanup deployment config
echo "Cleaning up deployment configuration..."
rm vite.config.deployment.js

# Step 11: Restore original vite config if it was backed up
if [ -f "vite.config.ts.backup" ]; then
    mv vite.config.ts.backup vite.config.ts
fi

echo "✅ Enhanced deployment build complete! Build artifacts are in dist/public/"
echo "Build size summary:"
du -sh dist/public/*