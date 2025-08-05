#!/bin/bash

echo "🚀 Building application for deployment..."

# Run the standard build process
npm run build

# Ensure static files are copied to the expected location for production
echo "📁 Copying static files for production..."
rm -rf server/public
cp -r dist/public server/public

# Verify the build is ready
echo "🔍 Verifying deployment readiness..."
if [ -f "dist/index.js" ] && [ -d "server/public" ] && [ -f "server/public/index.html" ]; then
    echo "✅ Build complete and ready for deployment!"
    echo ""
    echo "📋 Production files ready:"
    echo "  - Server: dist/index.js"
    echo "  - Static files: server/public/"
    echo "  - Entry point: server/public/index.html"
    echo ""
    echo "🎯 Deploy with: npm start"
else
    echo "❌ Build verification failed"
    exit 1
fi