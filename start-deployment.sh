#!/bin/bash

# Deployment startup script that ensures Node.js runtime is available
echo "🚀 Starting deployment with Node.js runtime..."

# Ensure Node.js is in PATH
export PATH="/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin:$PATH"

# Verify Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js runtime not found in deployment environment"
    exit 1
fi

echo "✅ Node.js runtime available: $(node --version)"

# Start the deployment server
exec node deploy.js