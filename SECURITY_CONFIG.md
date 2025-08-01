# Security Configuration Requirements

**CRITICAL: This project requires the following configuration to run securely:**

## Required package.json Script
Add this script to your package.json (you must do this manually as package.json cannot be edited by AI):

```json
{
  "scripts": {
    "build:dev": "vite build --mode development"
  }
}
```

## Required Environment Variables

### Database Configuration
- `DATABASE_URL`: Your database connection string

### Authentication Configuration  
- `REPLIT_DOMAINS`: Comma-separated list of allowed domains for auth
- `ISSUER_URL`: OIDC issuer URL (defaults to https://replit.com/oidc)
- `REPL_ID`: Your Replit application ID
- `SESSION_SECRET`: Secure session secret for authentication

### Payment Configuration (Optional)
- `STRIPE_SECRET_KEY`: Your Stripe secret key for payment processing

## Security Fixes Applied

✅ **Fixed Configuration Issues**
- Added port 8080 configuration to vite.config.ts
- Created proper index.html file in project root
- Removed unsafe external payment files (subscribe.html, success.html)

✅ **Database Security**
- Added RLS policies to secure data access
- Fixed security definer functions with proper search paths
- Restricted admin-only access to analysis statistics

✅ **Application Security**
- Removed unsafe external payment processing routes
- Added proper error handling for missing environment variables
- Secured authentication configuration

## Next Steps

1. **Add the build:dev script to package.json** (required for deployment)
2. **Configure environment variables** in your hosting environment
3. **Test authentication and payment flows** in a secure environment

All payment processing now goes through the authenticated main application instead of standalone HTML files.