#!/bin/bash

# Deployment script for fixing ESM/CommonJS module conflicts
echo "Starting deployment build process..."

# Backup original vite config
mv vite.config.ts vite.config.ts.original

# Create deployment vite config (CommonJS version)
cat > vite.config.js << 'EOF'
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  plugins: [],
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
  },
  server: {
    host: '::',
    port: 8080,
  },
});
EOF

# Run the build
echo "Running build with deployment configuration..."
npm run build

# Restore original vite config
mv vite.config.ts.original vite.config.ts
rm vite.config.js

echo "Deployment build complete! Build artifacts are in dist/public/"