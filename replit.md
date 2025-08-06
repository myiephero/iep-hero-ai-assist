# Overview
My IEP Hero is a comprehensive SaaS platform designed for Individualized Education Program (IEP) management. Its purpose is to empower parents and professionals with advanced collaboration tools and intuitive workflow management throughout the entire IEP lifecycle. Key capabilities include goal tracking, document storage, progress monitoring, and subscription-based service plans. The platform aims to provide a robust solution for navigating the complexities of IEPs, offering tools like AI-powered document analysis, smart letter generation, meeting preparation wizards, and communication tracking.

# User Preferences
Preferred communication style: Simple, everyday language.

# System Architecture
The application is a full-stack solution built with a modern, component-based approach.

## Recent Production Updates (Jan 2025)
- **Session Management Upgrade**: Replaced default MemoryStore with connect-pg-simple for production-ready PostgreSQL-based session storage, eliminating memory leaks and enabling horizontal scaling.

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
- **AI Integration**: Deep integration with **OpenAI GPT-4o** for features like AI-powered document analysis, IEP goal generation, smart letter generation, and meeting prep sheet generation. AI output validation requires specific keywords.
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