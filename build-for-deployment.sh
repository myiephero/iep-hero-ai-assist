#!/bin/bash

# Comprehensive build script for deployment environments
# Addresses npm cache issues, dependency resolution, and static build generation

set -e  # Exit on any error

echo "🚀 Starting deployment build process..."

# Step 1: Environment validation
echo "🔍 Validating build environment..."
node --version || (echo "❌ Node.js not found" && exit 1)
npm --version || (echo "❌ npm not found" && exit 1)

# Step 2: Fix npm dependencies
echo "🔧 Running dependency fix..."
if [ -f "./fix-npm-deps.sh" ]; then
    ./fix-npm-deps.sh
else
    echo "⚠️ Dependency fix script not found, proceeding with basic npm install"
    npm install --verbose
fi

# Step 3: Ensure build directory exists and is clean
echo "📁 Preparing build directory..."
mkdir -p dist/public
rm -rf dist/public/* || true

# Step 4: Create production-ready Vite config
echo "⚙️ Creating production Vite configuration..."
cat > vite.config.production.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
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
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: 'client/index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime']
  }
});
EOF

# Step 5: Verify required source files exist
echo "📋 Verifying source files..."
if [ ! -f "client/index.html" ]; then
    echo "❌ client/index.html not found!"
    ls -la client/ || echo "Client directory not found"
    exit 1
fi

if [ ! -d "client/src" ]; then
    echo "❌ client/src directory not found!"
    ls -la client/ || echo "Client directory not found"
    exit 1
fi

# Step 6: Run the production build
echo "🏗️ Running production build..."
echo "Using Vite version: $(npx vite --version)"

# Try multiple build approaches for maximum compatibility
if npx vite build --config vite.config.production.js --mode production; then
    echo "✅ Build successful with production config"
elif npx vite build --mode production; then
    echo "✅ Build successful with default config"
else
    echo "❌ Build failed with both configurations"
    echo "Attempting fallback build approach..."
    
    # Fallback: Try with minimal config but proper aliases
    cat > vite.config.fallback.js << 'EOF'
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
  root: process.cwd(),
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: 'client/index.html'
    }
  }
});
EOF
    
    if npx vite build --config vite.config.fallback.js; then
        echo "✅ Build successful with fallback config"
        rm vite.config.fallback.js
    else
        echo "❌ All build attempts failed"
        exit 1
    fi
fi

# Step 7: Verify build output
echo "🔍 Verifying build output..."
if [ -f "dist/public/index.html" ]; then
    echo "✅ index.html generated successfully"
    ls -la dist/public/
    
    # Check for JavaScript bundles
    if ls dist/public/assets/*.js 1> /dev/null 2>&1; then
        echo "✅ JavaScript bundles generated"
    else
        echo "⚠️ No JavaScript bundles found"
    fi
    
    # Check for CSS files
    if ls dist/public/assets/*.css 1> /dev/null 2>&1; then
        echo "✅ CSS files generated"
    else
        echo "⚠️ No CSS files found"
    fi
    
else
    echo "❌ Build verification failed: index.html not found"
    echo "Build directory contents:"
    ls -la dist/ || echo "dist directory not found"
    exit 1
fi

# Step 8: Generate build summary
echo "📊 Build Summary:"
echo "Build directory: $(pwd)/dist/public"
echo "Total files: $(find dist/public -type f | wc -l)"
echo "Total size: $(du -sh dist/public | cut -f1)"

# List all generated files
echo "Generated files:"
find dist/public -type f -exec ls -lh {} \; | sort

# Step 9: Cleanup temporary files
echo "🧹 Cleaning up..."
rm -f vite.config.production.js || true
rm -f vite.config.fallback.js || true

echo "✅ Deployment build complete!"
echo "Build artifacts are ready in dist/public/"