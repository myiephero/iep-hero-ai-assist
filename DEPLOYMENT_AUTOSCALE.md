# Replit Autoscale Deployment Configuration

## Current Deployment Issue
The deployment failed because the .replit file lacks proper deployment configuration for autoscale service.

## Required .replit Configuration

Since the system won't allow direct editing of .replit, you need to update it through the Replit Configuration pane:

```toml
[run]
command = "npm run dev"

[nix]
channel = "stable-24_11"

[env]
NODE_ENV = "development"
PORT = "5000"

[deployment]
run = ["node", "deploy.js"]
build = "npm run build"
deploymentTarget = "autoscale"

[deployment.env]
NODE_ENV = "production"
PORT = "5000"
REPLIT_DEPLOYMENT = "1"
```

## Required Configuration Steps

### 1. Update .replit file (via Configuration pane)
Add the `[deployment]` section with:
- `run = ["node", "deploy.js"]` - Entry point for autoscale deployment
- `build = "npm run build"` - Build command before deployment
- `deploymentTarget = "autoscale"` - Specify autoscale deployment

### 2. Environment Variables (via Deployment Configuration)
Set these in the Replit deployment Configuration pane:
- `NODE_ENV=production`
- `PORT=5000`
- `REPLIT_DEPLOYMENT=1`

### 3. Production Start Script
The deployment uses `deploy.js` which:
- Sets NODE_ENV=production
- Ensures PORT=5000 for autoscale
- Starts server-js.js production server

## Deployment Entry Points

### Development
- Command: `npm run dev`
- Entry: `server/index.ts` (development server)
- Port: Configured via .replit PORT

### Production/Deployment  
- Command: `node deploy.js`
- Entry: `deploy.js` → `server-js.js`
- Port: `process.env.PORT || 5000`

## Server Configuration Verification

✅ **Server listens on PORT environment variable**: 
- `server-js.js` uses `process.env.PORT || 5000`
- Listens on `0.0.0.0` (required for autoscale)

✅ **Health check endpoints available**:
- `/startup-health` - Deployment verification
- `/api/health` - Runtime health checks

✅ **Production-ready error handling**:
- Graceful shutdown (SIGTERM/SIGINT)
- Error recovery for deployment failures
- Static file serving from `dist/public`

## Files Created/Modified

1. **deploy.js** - Production deployment entry point
2. **server-js.js** - Enhanced with deployment logging
3. **DEPLOYMENT_AUTOSCALE.md** - This configuration guide

## Next Steps

1. Update .replit file configuration through the Replit interface
2. Add environment variables in deployment Configuration pane  
3. Deploy using the autoscale service
4. Verify deployment at health check endpoints

The deployment should now work with the proper autoscale configuration.