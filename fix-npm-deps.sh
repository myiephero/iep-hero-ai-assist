#!/bin/bash

# Script to fix npm dependency resolution issues for deployment
echo "🔧 Fixing npm dependency resolution issues..."

# 1. Clear npm cache completely
echo "📦 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true
rm -rf ~/.npm 2>/dev/null || true
rm -rf .npm 2>/dev/null || true

# 2. Remove problematic lock files and node_modules
echo "🗑️ Removing old dependencies..."
rm -rf node_modules 2>/dev/null || true
rm -f package-lock.json 2>/dev/null || true

# 3. Verify package.json has minimum required structure
echo "📋 Verifying package.json..."
if ! grep -q '"name"' package.json; then
    echo "⚠️ Warning: package.json missing name field"
fi

if ! grep -q '"version"' package.json; then
    echo "⚠️ Warning: package.json missing version field"
fi

# 4. Generate fresh package-lock.json
echo "🔄 Generating fresh package-lock.json..."
npm install --package-lock-only --verbose

# 5. Install dependencies with clean slate
echo "⬇️ Installing dependencies..."
npm ci --verbose --no-audit --no-fund 2>&1 | grep -E "(added|removed|updated|ERROR|error)" || true

# 6. Verify critical dependencies are installed
echo "✅ Verifying critical dependencies..."
MISSING_DEPS=()

# Check for Vite
if [ ! -d "node_modules/vite" ]; then
    MISSING_DEPS+=("vite")
fi

# Check for TypeScript
if [ ! -d "node_modules/typescript" ]; then
    MISSING_DEPS+=("typescript")
fi

# Check for React
if [ ! -d "node_modules/react" ]; then
    MISSING_DEPS+=("react")
fi

# Install any missing critical dependencies
if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "🚨 Installing missing critical dependencies: ${MISSING_DEPS[*]}"
    npm install "${MISSING_DEPS[@]}" --verbose
fi

# 7. Verify Vite can be executed
echo "🧪 Testing Vite availability..."
if npx vite --version > /dev/null 2>&1; then
    echo "✅ Vite is available and working"
    npx vite --version
else
    echo "❌ Vite is not working, attempting to fix..."
    npm install vite@latest --verbose
fi

# 8. Show final dependency status
echo "📊 Final dependency status:"
npm ls --depth=0 2>/dev/null | grep -E "(vite|typescript|react)" || echo "Some dependencies may be missing"

echo "✅ npm dependency fix complete!"