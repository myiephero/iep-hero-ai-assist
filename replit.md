# IEP Advocacy Platform

## Overview

This is a full-stack web application for IEP (Individualized Education Program) advocacy services. The platform provides subscription-based access to educational advocacy resources, consultation services, and support for families navigating the special education process. It features multiple subscription tiers across two user categories:

**Parent Plans** ($19-$59/month):
- Parent Basic ($19): Monthly consultations, email support, resource library
- Parent Premium ($39): Bi-weekly consultations, priority support, meeting prep
- Parent Pro ($59): Weekly consultations, emergency hotline, virtual meeting attendance

**Professional Advocate Plans** ($75-$199/month):
- Advocate Standard ($75): Unlimited consultations, meeting attendance, professional resources
- Advocate Premium ($125): 24/7 support, expert network, case management tools
- Advocate Enterprise ($199): Multi-case dashboard, white-label portal, custom training

The platform includes Stripe payment integration and comprehensive user authentication through Replit Auth.

## User Preferences

Preferred communication style: Simple, everyday language.

### Design System Colors
The "My IEP Hero" platform uses a specific calming color palette designed for parents navigating IEP challenges:

**Primary (Professional Blue):**
- HSL: `213 94% 68%` 
- Hex: `#4F9AFF`

**Secondary (Soft Sage Green):**
- HSL: `142 76% 73%`
- Hex: `#7DD3AC`

**Accent (Warm Support Orange):**
- HSL: `25 95% 53%`
- Hex: `#FF7A1A`

These colors are implemented as CSS custom properties in the design system and used throughout both the React application and standalone HTML pages.

**Current Status**: Color implementation needs refinement - user reported improvement from earlier iteration but still requires work to achieve the intended calming, professional appearance.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Routing**: Lightweight client-side routing solution
- **shadcn/ui Components**: Modern, accessible UI component library built on Radix UI primitives
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging, error handling, and request processing
- **Node.js with TypeScript**: Type-safe backend development with ES modules
- **Session Management**: Express sessions with PostgreSQL storage for persistent user sessions
- **Authentication Flow**: Replit Auth integration with OpenID Connect (OIDC) for secure user authentication

### Data Layer
- **PostgreSQL Database**: Primary data store hosted on Neon serverless infrastructure
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Connection Pooling**: Neon serverless connection pooling for optimal database performance
- **Database Schema**: Users table with subscription tracking, sessions table for auth state

### Payment Processing
- **Stripe Integration**: Secure payment processing with subscription management
- **Subscription Tiers**: Two-tier pricing model (Parent Basic, Advocate Pro)
- **Webhook Handling**: Real-time subscription status updates from Stripe
- **Customer Management**: Automated customer creation and subscription lifecycle management

### Authentication & Authorization
- **Replit Auth**: OAuth-based authentication with automatic user provisioning  
- **Session Security**: HTTP-only cookies with secure attributes and configurable TTL
- **Route Protection**: Middleware-based authentication checks for protected endpoints
- **User State Management**: Persistent user sessions with automatic token refresh

### Development Tools
- **Development Mode**: Hot module replacement with Vite dev server
- **Production Builds**: Optimized bundling with static asset serving
- **Database Migrations**: Drizzle Kit for schema version control and deployment
- **Error Handling**: Comprehensive error boundaries and API error responses

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Stripe**: Payment processing, subscription management, and billing
- **Replit Auth**: OAuth authentication service with OIDC compliance

### Frontend Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent visual elements
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities

### Backend Libraries
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Connect-PG-Simple**: PostgreSQL session store adapter
- **Memoizee**: Function memoization for performance optimization
- **WebSocket Support**: Real-time capabilities through ws library

### Build & Development
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Static type checking across the entire application
- **Replit Plugins**: Development environment integration and error overlays

## Recent Deployment Fixes (August 2025)

### Cloud Run Deployment Configuration
Applied critical fixes for Cloud Run deployment failures:

1. **Port Configuration Standardization**: 
   - Unified all server configurations to use PORT environment variable (defaulting to 5000)
   - Updated server/index.ts, server/minimal.ts, and server-js.js for consistent port handling
   - Removed duplicate server configurations that caused port conflicts

2. **Error Handling Enhancement**:
   - Added graceful error handling for demo setup failures
   - Implemented retry mechanisms for production environments
   - Added proper SIGTERM/SIGINT handling for graceful shutdowns

3. **Production Server Configuration**:
   - Created production-ready server-js.js with static file serving
   - Added health check endpoints with environment reporting
   - Implemented proper error middleware and SPA routing

4. **Container Deployment Support**:
   - Added Dockerfile for Cloud Run compatibility
   - Created cloudbuild.yaml for Google Cloud Build integration
   - Added .dockerignore for optimized container builds

5. **Single External Port Resolution (August 8, 2025)**:
   - Enhanced production server logging to clearly identify port configuration
   - Added startup health check endpoint (/startup-health) to prevent demo setup blocking
   - Improved error handling with specific messaging for port conflicts
   - Added Docker health checks for Cloud Run deployment verification
   - Installed curl in Docker container for health check compatibility
   - Explicitly configured single external port (5000→80) in Dockerfile and cloudbuild.yaml

### Changes Made:
- **Removed**: Duplicate iep-hero-ai-assist directory causing port conflicts
- **Updated**: All server files to respect PORT environment variable
- **Added**: Production deployment configuration files
- **Enhanced**: Error handling to prevent startup failures in Cloud Run
- **Fixed**: Multiple external port configuration issue for Cloud Run compatibility
- **Added**: Health check endpoints and Docker container verification

6. **Replit Autoscale Deployment Configuration (August 8, 2025)**:
   - Created deploy.js as proper deployment entry point for autoscale service
   - Enhanced server-js.js with deployment detection (REPLIT_DEPLOYMENT environment variable)
   - Added comprehensive deployment health checks with autoscale configuration details
   - Created DEPLOYMENT_AUTOSCALE.md with complete configuration instructions
   - Fixed missing deployment configuration that was causing autoscale deployment failures

**Status**: Multiple deployment targets supported:
- **Cloud Run**: Single external port (5000→80), Docker containerized deployment
- **Replit Autoscale**: Native Replit deployment with deploy.js entry point and autoscale configuration
- Both deployments include enhanced error handling, health checks, and production-ready server configuration

### Deployment Configuration Requirements:
Since .replit and package.json files cannot be edited directly, the following must be configured through the Replit interface:

#### Required .replit Updates (via Configuration pane):
```toml
[deployment]
run = ["node", "deploy.js"]
build = "npm run build" 
deploymentTarget = "autoscale"

[deployment.env]
NODE_ENV = "production"
PORT = "5000"
REPLIT_DEPLOYMENT = "1"
```

#### Files Created for Deployment:
- **deploy.js**: Autoscale deployment entry point
- **server-js.js**: Enhanced production server with deployment detection
- **DEPLOYMENT_AUTOSCALE.md**: Complete configuration guide

### Known Development Environment Considerations:
- Development environment (.replit, vite.config.ts) uses port 8080 but cannot be modified
- Production deployment correctly overrides with PORT environment variable (5000)
- Multiple deployment targets supported: Cloud Run (containerized) and Replit Autoscale (native)
- Both deployments use single external port configuration as required