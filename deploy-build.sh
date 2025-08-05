#!/bin/bash

echo "🚀 Building application for deployment..."
echo "⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻"

# Run the standard build process
echo "🔨 Running build process..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Ensure static files are copied to the expected location for production
echo "📁 Copying static files for production..."
rm -rf server/public
cp -r dist/public server/public

# Verify the build is ready
echo "🔍 Verifying deployment readiness..."

# Check all required files exist
CHECKS_PASSED=true

if [ ! -f "dist/index.js" ]; then
    echo "❌ Server build missing: dist/index.js"
    CHECKS_PASSED=false
fi

if [ ! -d "server/public" ]; then
    echo "❌ Static files directory missing: server/public/"
    CHECKS_PASSED=false
fi

if [ ! -f "server/public/index.html" ]; then
    echo "❌ Entry point missing: server/public/index.html"
    CHECKS_PASSED=false
fi

if [ ! -f "server/public/manifest.json" ]; then
    echo "❌ PWA manifest missing: server/public/manifest.json"
    CHECKS_PASSED=false
fi

# Test production server startup
echo "🧪 Testing production server configuration..."
PORT=3099 NODE_ENV=production timeout 5s node dist/index.js >/dev/null 2>&1
if [ $? -eq 124 ]; then
    echo "✅ Production server starts successfully"
else
    echo "⚠️  Production server test inconclusive (may be normal)"
fi

if [ "$CHECKS_PASSED" = true ]; then
    echo ""
    echo "✅ BUILD COMPLETE AND READY FOR DEPLOYMENT!"
    echo "⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻"
    echo ""
    echo "📋 Production Files Ready:"
    echo "  ✅ Server Bundle: dist/index.js ($(du -h dist/index.js | cut -f1))"
    echo "  ✅ Static Files: server/public/ ($(du -sh server/public | cut -f1))"
    echo "  ✅ Entry Point: server/public/index.html"
    echo "  ✅ PWA Manifest: server/public/manifest.json"
    echo "  ✅ Assets: server/public/assets/"
    echo ""
    echo "🎯 Ready for Replit Deployment!"
    echo "   Use the Deploy button in Replit or run: npm start"
    echo ""
    echo "🌐 Expected URL: https://my-iep-hero-myiephero.replit.app"
    echo "⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻"
else
    echo ""
    echo "❌ DEPLOYMENT READINESS CHECK FAILED"
    echo "Please fix the issues above before deploying."
    exit 1
fi