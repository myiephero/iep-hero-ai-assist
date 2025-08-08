#!/bin/bash

# Production deployment script that handles all known build issues
# This script addresses npm cache issues, ESM conflicts, and path resolution

set -e  # Exit on any error

echo "🚀 Starting production deployment process..."

# Step 1: Clean environment
echo "🧹 Cleaning build environment..."
rm -rf dist/public/* || true
rm -rf node_modules/.vite || true
rm -rf node_modules/.cache || true

# Step 2: Fix client/index.html path issue
echo "🔧 Fixing HTML import paths..."
cp client/index.html client/index.html.backup
sed 's|src="/src/main.tsx"|src="./src/main.tsx"|g' client/index.html.backup > client/index.html

# Step 3: Create minimal production vite config without ESM issues
echo "⚙️ Creating production-safe Vite configuration..."
cat > vite.config.prod.mjs << 'EOF'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html')
    }
  }
})
EOF

# Step 4: Run production build
echo "🏗️ Running production build..."
if npx vite build --config vite.config.prod.mjs --mode production; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed, trying fallback approach..."
    
    # Create even simpler config
    cat > vite.config.simple.js << 'EOF'
const path = require('path')

module.exports = {
  root: __dirname,
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: 'client/index.html'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  }
}
EOF
    
    npx vite build --config vite.config.simple.js --mode production
    rm vite.config.simple.js
fi

# Step 5: Restore original HTML file
echo "🔄 Restoring original HTML file..."
mv client/index.html.backup client/index.html

# Step 6: Verify build output
echo "🔍 Verifying build output..."
if [ -f "dist/public/index.html" ]; then
    echo "✅ Build successful! Generated files:"
    ls -la dist/public/
    
    # Show build size
    echo "📊 Build size: $(du -sh dist/public | cut -f1)"
else
    echo "❌ Build failed - no output generated"
    exit 1
fi

# Step 7: Cleanup
echo "🧹 Cleaning up temporary files..."
rm -f vite.config.prod.mjs || true

echo "✅ Production deployment build complete!"
echo "Deploy the contents of dist/public/ to your hosting platform"