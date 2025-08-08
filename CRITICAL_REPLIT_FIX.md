# CRITICAL: Run Button Configuration Fix

## Problem Identified
The `.replit` file has syntax errors preventing Node.js installation and Run button functionality.

## Current LSP Errors
1. `command = ["npm", "run", "start"]` - Arrays not allowed, must be string
2. Unexpected `env` property in deployment section

## EXACT .replit Fix Required

**Replace your entire `.replit` file with this correct syntax:**

```toml
[run]
command = "npm run start"

[nix]
channel = "stable-24_11"

[env]
NODE_ENV = "development"
PORT = "5000"

[deployment]
run = "npx tsx server/index.ts"
build = "npm run build"
deploymentTarget = "autoscale"

[deployment.env]
NODE_ENV = "production" 
PORT = "5000"
REPLIT_DEPLOYMENT = "1"
```

## Key Changes from Current Config
1. `command = ["npm", "run", "start"]` → `command = "npm run start"` (string not array)
2. `run = ["npx", "tsx", "server/index.ts"]` → `run = "npx tsx server/index.ts"` (string not array)
3. Remove the erroneous `env` property

## After Fix
1. Repl will automatically reload with Node.js environment
2. Run button will execute `npm run start` 
3. Server will start on port 5000
4. Health check available at `/api/health`

## Files Already Ready ✅
- server/index.ts - Express server configured
- package.json - Has "start": "tsx server/index.ts" 
- tsx dependency - Already installed
- All environment variables - Configured via Replit Secrets

**Status: All code ready - only .replit syntax blocking Run button**