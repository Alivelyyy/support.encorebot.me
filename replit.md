# Support Ticket System for EncoreBot & Team Epic

## Overview

This is a professional support ticket management system designed for Team Epic and EncoreBot services. The application provides a complete ticketing solution where users can submit support requests across multiple service categories, and administrators can manage and respond to tickets through a dedicated admin panel. Built with a modern dark theme featuring purple/blue gradients matching Team Epic's branding, the system uses a full-stack TypeScript architecture with React on the frontend and Express on the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript using Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark-first design system with purple/blue gradient brand colors
- Component variants managed through class-variance-authority (CVA)

**Design Approach**
- Hybrid utility-focused design with strong brand identity
- Modern dark UI patterns inspired by Linear and Discord
- Custom color palette defined in CSS variables for theme consistency
- Inter font family loaded from Google Fonts

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- Session-based authentication using express-session with MemoryStore
- Bcrypt for password hashing

**API Design**
- RESTful API structure with routes organized by resource type
- Session management for user authentication state
- API endpoints include:
  - `/api/auth/*` - User registration, login, logout, and session verification
  - `/api/tickets` - Ticket creation, retrieval, and status updates
  - `/api/tickets/:id/responses` - Ticket response management

**Development Setup**
- Vite middleware integration for HMR (Hot Module Replacement) in development
- Custom error logging and request duration tracking
- Separate build outputs for client (public assets) and server (bundled with esbuild)

### Data Storage Solutions

**Database**
- PostgreSQL as the primary database using Neon serverless adapter
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with shared TypeScript types between client and server

**Database Schema**
Three main tables:
1. **Users**: Stores user accounts with email, hashed password, full name, admin flag, and creation timestamp
2. **Tickets**: Contains ticket information including user reference, title, description, category, service type, status, and timestamps
3. **Responses**: Thread of messages for each ticket with user reference, message content, staff flag, and timestamp

**Migration Strategy**
- Drizzle Kit for schema migrations stored in `/migrations` directory
- Push-based deployment using `db:push` script

**Current Storage Implementation**
- In-memory storage adapter (MemStorage) provides the storage interface during development
- Storage interface (IStorage) abstracts database operations for easy swapping between implementations
- Production setup expects PostgreSQL connection via DATABASE_URL environment variable

### Authentication & Authorization

**Authentication Flow**
- Session-based authentication using HTTP-only cookies
- 7-day session duration with automatic cleanup
- Password hashing with bcryptjs (10 salt rounds)
- Session data stored in memory (upgradeable to PostgreSQL session store via connect-pg-simple)

**Authorization Levels**
- Regular users: Can create and view their own tickets, add responses
- Admin users: Access to admin panel, can view all tickets, manage ticket status, respond as staff

**Session Security**
- Secure cookies enforced in production environment
- CSRF protection through session secret
- HTTP-only cookies prevent client-side JavaScript access

### External Dependencies

**Third-Party UI Libraries**
- Radix UI primitives for accessible component foundations (dialogs, dropdowns, popovers, etc.)
- date-fns for date formatting and manipulation
- Lucide React for icon components

**Development Tools**
- Replit-specific plugins for development environment integration
- TypeScript for type safety across the entire stack
- ESBuild for server-side bundling in production

**Email Service Integration**
- Email verification system using Supabase Auth
- Sends verification emails from verify@encorebot.me (configurable SMTP)
- HTML email templates for professional verification flow
- 24-hour token expiry with secure verification process
- Users must verify email before accessing protected features
- See SUPABASE_EMAIL_SETUP.md for complete configuration guide

**Service Categories**
The system supports two main service types with distinct categories:
- **Team Epic**: General Support, Web Development, Discord Bots, Roblox Games, Graphic Design
- **Encore Bot**: No Prefix, Bugs, Suggestions, Feedback, Premium