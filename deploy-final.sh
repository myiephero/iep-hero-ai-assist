#!/bin/bash

# Final production deployment script with correct file structure handling
set -e

echo "🚀 Production Build for Deployment"

# Step 1: Clean environment
echo "🧹 Cleaning build environment..."
rm -rf dist/public/* || true

# Step 2: Fix HTML import path for build
echo "🔧 Fixing HTML import paths..."
cp client/index.html client/index.html.backup
sed 's|src="/src/main.tsx"|src="./src/main.tsx"|g' client/index.html.backup > client/index.html

# Step 3: Create production vite config
echo "⚙️ Creating production Vite configuration..."
cat > vite.prod.mjs << 'EOF'
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

# Step 4: Build
echo "🏗️ Building for production..."
npx vite build --config vite.prod.mjs --mode production

# Step 5: Move files to correct structure for deployment
echo "📁 Organizing build output..."
if [ -f "dist/public/client/index.html" ]; then
    # Move the built HTML to root of public
    mv dist/public/client/index.html dist/public/index.html
    # Remove empty client directory
    rmdir dist/public/client || true
    echo "✅ Files reorganized for deployment"
fi

# Step 6: Restore original HTML
mv client/index.html.backup client/index.html

# Step 7: Verify final output
echo "🔍 Final build verification..."
if [ -f "dist/public/index.html" ]; then
    echo "✅ Deployment build successful!"
    echo "📊 Build contents:"
    ls -la dist/public/
    echo "📏 Build size: $(du -sh dist/public | cut -f1)"
    
    # Verify HTML content
    if grep -q "assets/index-" dist/public/index.html; then
        echo "✅ HTML properly references assets"
    else
        echo "⚠️ HTML may not properly reference assets"
    fi
    
else
    echo "❌ Build failed - index.html not found in expected location"
    echo "Available files:"
    find dist/public -type f || true
    exit 1
fi

# Step 8: Cleanup
rm vite.prod.mjs

echo "✅ Production deployment build complete!"
echo "📦 Deploy the contents of dist/public/ to your hosting platform"
echo "🌐 Entry point: dist/public/index.html"