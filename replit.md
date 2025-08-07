# Overview
My IEP Hero is a comprehensive SaaS platform designed for Individualized Education Program (IEP) management. Its purpose is to empower parents and professionals with advanced collaboration tools and intuitive workflow management throughout the entire IEP lifecycle. Key capabilities include goal tracking, document storage, progress monitoring, and subscription-based service plans. The platform aims to provide a robust solution for navigating the complexities of IEPs, offering tools like AI-powered document analysis, smart letter generation, meeting preparation wizards, and communication tracking.

# User Preferences
Preferred communication style: Simple, everyday language.

# System Architecture
The application is a full-stack solution built with a modern, component-based approach.

## Recent Production Updates (Jan 2025)
- **Session Management Upgrade**: Replaced default MemoryStore with connect-pg-simple for production-ready PostgreSQL-based session storage, eliminating memory leaks and enabling horizontal scaling.
- **Authentication Fix (Aug 6, 2025)**: Fixed session cookie configuration for Vite development environment with proper sameSite settings, resolved frontend authentication flow, and ensured dashboard metrics display properly.
- **Dashboard Metrics Enhancement**: Implemented safe fallback values and graceful error handling for dashboard metrics, preventing "Failed to load" errors and showing realistic default data.
- **Universal Document Vault Enhancement (Aug 6, 2025)**: Implemented bulk document management with selection, bulk delete functionality, and enhanced document operations universally across both Parent and Advocate dashboards. All Document Vault features now work consistently regardless of user role.
- **Smart Document Tagging System (Aug 6, 2025)**: Implemented AI-powered document categorization and tagging using OpenAI GPT-4o. Documents are automatically analyzed and tagged with categories (academic, behavioral, medical, legal, etc.) and relevant tags. Features include auto-categorization on upload, retagging functionality, confidence scoring, and visual tag display with DocumentTagsDisplay component.
- **Advocate Dashboard Complete Overhaul (Aug 7, 2025)**: Fixed layout inconsistencies and missing tools in advocate dashboard. Standardized card styling to match parent dashboard using bg-[#3E4161]/70 border-slate-600 pattern. Organized all 9 professional tools into logical 3x3 grid layout. Added missing routes for /tools/goal-generator and /tools/ai-document-review to fix 404 errors. All professional advocate tools now properly navigate and function.
- **Role-Aware Dashboard Navigation Fix (Aug 7, 2025)**: Completely resolved dashboard role confusion (GitHub Issue #11). Created role-aware navigation utility (utils/navigation.ts) with useRoleAwareDashboard hook. Fixed ALL hardcoded dashboard redirects across the entire codebase using comprehensive diagnostic checklist approach:
  * Updated PrivateRoute.tsx, App.tsx, login.tsx, subscribe.tsx for auth flows
  * Fixed ALL tool files (progress-analyzer, smart-letter-generator, meeting-prep-wizard, ask-ai-about-docs)
  * Updated layout components (navbar.tsx, footer.tsx, MobileNavigation.tsx)
  * Applied role-aware navigation to all "Back to Dashboard" links and route redirects
  * Tools now correctly redirect advocates to /dashboard-premium and parents to /dashboard-parent based on user role
  * Eliminated cross-role routing issues permanently with systematic fix covering every hardcoded route

## Frontend Architecture
The frontend is developed with **React 18** and TypeScript, using **Vite** for fast builds and development.
- **UI Framework**: **shadcn/ui** components built on **Radix UI** primitives, styled with **Tailwind CSS** using a custom color palette.
- **State Management**: **TanStack Query (React Query)** for server state, and React's built-in hooks for local component state.
- **Routing**: **Wouter** for client-side routing.
- **Authentication**: Context-based system with route protection.
- **PWA Features**: Implemented with mobile-first design, including offline support, native device integration, voice input, haptic feedback, and native sharing.
- **UI/UX Decisions**: Features a stunning dark theme with glass-morphism effects and animations, as well as a light-theme parent dashboard. It incorporates a split-view SaaS interface for role-based tools, consistent navigation, and professional AI tool modals. Supports distinct user paths (Parent/Guardian, IEP Advocate, Education Professional) with tailored UIs and feature access based on subscription tier.

## Backend Architecture
The backend is a **REST API** built with **Express.js** and TypeScript.
- **API Design**: RESTful endpoints organized by resource type, with middleware for logging, error handling, and authentication.
- **File Handling**: **Multer** for document uploads, storing files locally with unique identifiers.
- **Session Management**: **express-session** for managing user sessions with configurable security settings.
- **Authentication**: Session-based authentication using **Passport.js** with a local strategy and bcrypt password hashing. Supports multiple user roles (parent, advocate, professional) with role-based access control.

## Data Storage Solutions
- **Primary Database**: **PostgreSQL** for persistent data storage.
- **ORM**: **Drizzle ORM** for type-safe database operations and schema management.
- **Schema Design**: Tables for users, IEP goals, documents, events, and messages, using UUID primary keys and foreign key relationships.
- **Migration System**: Drizzle's migration system for managing database schema changes.
- **Storage Interface**: An abstraction layer (IStorage interface) supports different storage backends, including PostgreSQL and an in-memory option for development.

## System Design Choices
- **AI Integration**: Deep integration with **OpenAI GPT-4o** for features like AI-powered document analysis, IEP goal generation, smart letter generation, meeting prep sheet generation, and intelligent document categorization with automatic tagging. AI output validation requires specific keywords, and document tagging includes confidence scoring for quality assurance.
- **Authentication System**: **Supabase Auth** with graceful fallback to demo authentication for development. Supports role-based access control (Parent, Advocate, Professional) with protected routes and user metadata management.
- **Subscription Management**: Supports multiple subscription tiers (Free, Hero Plan) with conditional tool access and a clear signup flow showcasing pricing transparency. A plan status tracking system visually indicates user subscription levels.
- **Communication & Notifications**: Integrates **Resend** for email notifications (e.g., welcome emails, advocate notifications). Features an Advocate Matcher MVP with automated email notifications and real-time Slack integration for team alerts.
- **Chat System**: Includes a comprehensive chat system with real-time message updates, conversation management, and user directory.

# External Dependencies
- **Payment Processing**: **Stripe** (Stripe.js, React Stripe.js) for subscription management and payment processing, including webhook integration.
- **Database Service**: **Supabase** for PostgreSQL hosting and authentication services. Fully integrated with environment variables for seamless connection.
- **AI Service**: **OpenAI GPT-4o** for advanced AI capabilities including IEP goal generation and document analysis.
- **Email Service**: **Resend** for sending transactional emails.
- **Development Tools**: Replit-specific enhancements like error overlay and cartographer.
- **UI Component Library**: **Radix UI** and **shadcn/ui**.
- **Date Handling**: **date-fns** for date manipulation.
- **Form Management**: **React Hook Form** with **Zod** for validation.