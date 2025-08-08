#!/bin/bash
# Temporary run script to test server startup

echo "🚀 Starting My IEP Hero server..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please fix .replit configuration first."
    echo "Current .replit syntax errors:"
    echo "  1. command should be: ['npm', 'run', 'start'] (array, not string)"
    echo "  2. Remove the 'env' property from [deployment.env] section"
    exit 1
fi

# Check if npm is available  
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please fix .replit configuration first."
    exit 1
fi

# Try to start the server
echo "✅ Node.js and npm found. Starting server..."
npm run start