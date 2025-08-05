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

✅ **Critical Database Security (Phase 1)**
- Enabled RLS on missing tables: `assignments`, `email_events`
- Created comprehensive RLS policies for all database access
- Fixed all 9 database security definer functions with `SET search_path TO 'public'`
- Secured data access based on user roles and ownership

✅ **Authentication & Session Security (Phase 2)**
- Enforced strong `SESSION_SECRET` requirement (server fails if not set)
- Implemented conditional secure cookie configuration (secure: true in production)
- Added session validation and security warnings
- Enhanced authentication error handling and logging

✅ **Payment Security (Phase 3)**
- Implemented Stripe webhook signature verification
- Added comprehensive input validation for payment endpoints
- Applied strict rate limiting to sensitive endpoints (10 req/15min)
- Enhanced error handling and request sanitization

✅ **Additional Security Hardening (Phase 4)**
- Added input sanitization middleware (XSS prevention)
- Implemented custom rate limiting (100 req/15min general, 10 req/15min sensitive)
- Added security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Enhanced request validation and timeout protection
- Secured all API endpoints with proper authentication

## Next Steps

1. **Add the build:dev script to package.json** (required for deployment)
2. **Configure environment variables** in your hosting environment
3. **Test authentication and payment flows** in a secure environment

All payment processing now goes through the authenticated main application instead of standalone HTML files.