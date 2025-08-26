#!/bin/bash

# Hard refresh deployment fix script
echo "🔄 Hard refresh deployment fix starting..."

# Set proper PATH
export PATH="/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:$PATH"

# Kill any hanging processes
pkill -9 -f vite 2>/dev/null || true
pkill -9 -f node 2>/dev/null || true

# Clear all caches
echo "🧹 Clearing caches..."
rm -rf dist/ node_modules/.vite node_modules/.cache .npm 2>/dev/null || true

# Fix PostCSS config (CommonJS)
echo "🔧 Fixing PostCSS config..."
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
EOF

# Fix HTML import path
echo "🔧 Fixing HTML import path..."
sed -i 's|src="/src/main.tsx"|src="./src/main.tsx"|g' client/index.html

# Create working vite config
echo "🔧 Creating deployment-safe Vite config..."
cat > vite.config.js << 'EOF'
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: __dirname,
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  esbuild: {
    jsx: 'automatic'
  }
});
EOF

echo "✅ Hard refresh complete - configuration updated"
echo "ℹ️ You can now try deploying again"