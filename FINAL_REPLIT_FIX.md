# FINAL .replit Configuration Fix

## Current Problem
LSP still shows errors in .replit preventing Node.js installation:
- Error on line 1: command syntax issue
- Error on line 12: unexpected 'env' property

## Working .replit Configuration

Replace your entire `.replit` file with this minimal working version:

```toml
run = "npm run start"

[nix]
channel = "stable-24_11"

[env]
NODE_ENV = "development"
PORT = "5000"

[deployment]
run = "npx tsx server/index.ts"
build = "npm run build"
deploymentTarget = "autoscale"
```

## Key Changes
1. Removed `[run]` section header - use direct `run = "command"`
2. Removed `[deployment.env]` section entirely (causing validation error)
3. Simplified to essential configuration only

## Alternative: Direct tsx Execution
If npm still doesn't work, try this version:

```toml
run = "npx tsx server/index.ts"

[nix]
channel = "stable-24_11"

[env]
NODE_ENV = "development"
PORT = "5000"
```

This bypasses npm and runs tsx directly since it's already installed.

## Testing Commands After Fix
1. Click Run button
2. Or use: `npm run start`  
3. Or direct: `npx tsx server/index.ts`

Server should start on port 5000 with health endpoint ready.