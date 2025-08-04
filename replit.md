# Overview

My IEP Hero is a comprehensive SaaS platform for Individualized Education Program (IEP) management, designed to empower parents and professionals with advanced collaboration tools and intuitive workflow management. The application provides complete IEP lifecycle management including goal tracking, document storage, progress monitoring, and subscription-based service plans.

## Recent Changes (January 2025)
- ✓ Full-stack application successfully migrated and integrated
- ✓ Supabase authentication system implemented and working  
- ✓ Dashboard with IEP goals, documents, and events tracking
- ✓ Stripe payment integration for multiple subscription tiers
- ✓ Build:dev script added for Lovable.dev compatibility
- ✓ Application running successfully on port 5000
- ✓ Memory Q&A component with advocate sharing functionality
- ✓ Database schema extended with sharedMemories table and advocateEmail field
- ✓ Resend email integration for advocate notifications
- ✓ Test routes implemented for Memory Q&A functionality validation
- ✓ AI output validation requiring "services", "goals", or "accommodations" keywords
- ✓ Duplicate prevention system with 60-second window for identical questions
- ✓ Comprehensive test suite validating all Memory Q&A features
- ✓ Progressive Web App (PWA) implementation with mobile-first design
- ✓ Mobile navigation, offline support, and native device integration
- ✓ PWA install prompts, service worker caching, and mobile-optimized components
- ✓ Voice input, haptic feedback, and native sharing capabilities
- ✓ Comprehensive pricing page with Free vs Hero Plan ($495/year) comparison
- ✓ Hero Plan modal with detailed feature breakdown and Stripe checkout integration
- ✓ User registration and authentication system working correctly
- ✓ Database storage fully operational with PostgreSQL backend
- ✓ User registration persisting to database successfully
- ✓ Authentication system integrated with persistent storage
- ✓ Crystal clear signup flow with pricing transparency implemented
- ✓ Users now see exactly what they're signing up for (Free vs $495 Hero Plan)
- ✓ Email verification with welcome emails working perfectly
- ✓ Registration page shows beautiful pricing comparison before signup
- ✓ Clear messaging throughout: "You're creating a FREE account" vs "You're unlocking the $495 Hero Family Offer"
- ✓ Seamless role-based signup flow with clear value propositions implemented
- ✓ Three distinct user paths: Parent/Guardian, IEP Advocate, Education Professional
- ✓ Role-specific value propositions and feature customization
- ✓ Intuitive 3-step flow: Role Selection → Pricing Plans → Registration Form
- ✓ Each role gets tailored benefits and pricing plan descriptions
- ✓ Easy navigation between steps with back buttons and role/plan changing options
- ✓ Comprehensive plan status tracking system implemented
- ✓ Database stores planStatus field: "free", "heroOffer", "retainer"
- ✓ Beautiful plan status badges and cards displaying user's subscription level
- ✓ Dashboard shows clear plan status with upgrade options for free users
- ✓ Plan-specific features and benefits clearly communicated throughout UI
- ✓ Demo login credentials with proper plan assignments:
  - parent@demo.com/demo123 → Hero Plan ($495/year) with full features
  - advocate@demo.com/demo123 → Free Plan with basic features
- ✓ Stunning dark theme with glass-morphism effects and animations implemented
- ✓ Login and registration flows completely redesigned with premium UX
- ✓ Authentication system working correctly with proper session management
- ✓ Real AI-powered document analysis with OpenAI GPT-4o integration
- ✓ Professional document analysis results modal with scoring and recommendations
- ✓ Fixed subscription page error - now shows success message for MVP testing
- ✓ AI document analyzer provides expert IEP analysis with compliance checking

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using **React 18** with TypeScript, utilizing a modern component-based architecture. The application uses **Vite** as the build tool and development server, providing fast hot module replacement and optimized builds.

**UI Framework**: The application leverages **shadcn/ui** components built on top of **Radix UI** primitives, providing accessible and customizable UI components. The design system uses **Tailwind CSS** for styling with a custom color palette optimized for the IEP management domain.

**State Management**: The application uses **TanStack Query (React Query)** for server state management, providing caching, synchronization, and background updates. Local component state is managed using React's built-in hooks.

**Routing**: Client-side routing is implemented using **Wouter**, a lightweight routing library that provides declarative routing without the overhead of React Router.

**Authentication**: The frontend implements a context-based authentication system that manages user sessions and provides route protection through higher-order components.

## Backend Architecture
The backend follows a **REST API** architecture built with **Express.js** and TypeScript. The server implements session-based authentication using **Passport.js** with local strategy for email/password authentication.

**API Design**: RESTful endpoints are organized by resource type (users, goals, documents, events, messages) with proper HTTP methods and status codes. The API includes middleware for request logging, error handling, and authentication.

**File Handling**: Document uploads are handled using **Multer** middleware with file type validation and size limits. Uploaded files are stored in a local uploads directory with unique identifiers.

**Session Management**: User sessions are managed using **express-session** with configurable security settings. Session data persists user authentication state across requests.

## Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations and schema management.

**Schema Design**: The database schema includes tables for users, IEP goals, documents, events, and messages. Each table uses UUID primary keys for scalability and includes proper foreign key relationships.

**Migration System**: Database schema changes are managed through Drizzle's migration system, allowing version control of database structure changes.

**Storage Interface**: The application implements an abstraction layer (IStorage interface) that allows for different storage backends. Currently includes both production PostgreSQL implementation and in-memory storage for development/testing.

## Authentication and Authorization
**Authentication Strategy**: The system uses session-based authentication with bcrypt password hashing. Users authenticate with email/password credentials, and sessions are maintained server-side.

**Role-Based Access**: The application supports multiple user roles (parent, advocate, professional) with role-specific features and permissions built into the UI and API endpoints.

**Session Security**: Sessions include security configurations such as secure cookies in production, session expiration, and protection against common session-based attacks.

## External Dependencies

**Payment Processing**: Stripe integration for subscription management, including both client-side (Stripe.js, React Stripe.js) and server-side components. The application supports multiple subscription tiers (free, basic, professional, enterprise) with Stripe webhooks for payment processing.

**Database Service**: Neon Database serverless PostgreSQL for cloud-hosted database with connection pooling and automatic scaling capabilities.

**Development Tools**: The application includes Replit-specific development enhancements including error overlay, cartographer for debugging, and development banner integration.

**UI Component Library**: Extensive use of Radix UI primitives for accessible component foundations, with shadcn/ui providing pre-built component implementations.

**Date Handling**: date-fns library for consistent date formatting and manipulation across the application.

**Form Management**: React Hook Form with Zod for form validation and hookform/resolvers for schema-based validation integration.
 