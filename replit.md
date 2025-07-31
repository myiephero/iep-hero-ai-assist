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