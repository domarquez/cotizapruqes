# Playground & Wooden House Quotation System

## Overview

A modular quotation system for playground equipment and wooden houses. This web application allows customers to configure custom playground structures or wooden houses by selecting base platforms and adding modular components, with real-time pricing based on usage type (domestic vs. public/institutional). The system includes an admin panel for managing inventory and pricing, and generates quotations with client information that can be saved or exported as PDFs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and API data fetching
- Tailwind CSS with custom design system for styling

**Component Strategy:**
The application uses shadcn/ui component library (New York variant) built on Radix UI primitives. This provides accessible, customizable components with a consistent design language. Components are located in `client/src/components/ui/` and follow a composition pattern.

**Design System:**
Custom design system based on Material Design foundations combined with e-commerce configurator patterns. Key design principles:
- Typography: Inter for headings/UI, Open Sans for body text
- Spacing: Tailwind unit system (2, 4, 6, 8, 12, 16, 20, 24)
- Color system: HSL-based CSS variables for theming with light/dark mode support
- Interactive states: Custom elevation classes (`hover-elevate`, `active-elevate-2`) for depth feedback

**State Management:**
- TanStack Query manages all server data with automatic caching and refetching
- Local component state (useState) for UI interactions like module selection and quantity tracking
- No global state management library needed due to query-based architecture

**Key User Flows:**
1. **Home Page:** Hero with CTA, featured products, statistics
2. **Configurator:** Multi-step product configuration (platform selection → module selection → pricing summary)
3. **Gallery:** Project showcase grid
4. **Admin Panel:** Password-protected CRUD operations for platforms, modules, and houses

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for HTTP server
- TypeScript throughout for type safety
- ESM modules (not CommonJS)

**API Design:**
RESTful API endpoints organized in `server/routes.ts`:
- GET/POST/PATCH/DELETE operations for platforms, modules, and houses
- POST endpoint for quote creation
- All routes prefixed with `/api/`
- Response format: JSON with appropriate HTTP status codes
- Error handling with try-catch blocks returning 400/404/500 status codes

**Request Processing:**
- Express middleware for JSON body parsing
- Custom logging middleware tracking request duration and response data
- Request validation using Zod schemas (drizzle-zod integration)

### Data Layer

**Database:**
PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)

**ORM:**
Drizzle ORM chosen for:
- Type-safe query building
- Schema-first approach with migration support
- Lightweight compared to alternatives
- Native TypeScript support

**Schema Design:**
Four main tables defined in `shared/schema.ts`:

1. **platforms:** Base playground structures
   - height variants (80cm to 150cm)
   - Separate pricing for domestic vs. public use
   - Category field for future expansion

2. **modules:** Add-on components (roofs, slides, walls, etc.)
   - Categorized (techos, resbales, paredes, etc.)
   - Material specifications (different for domestic/public)
   - Product type association (playground/house)

3. **houses:** Wooden house catalog
   - Size specifications (width × length)
   - Dual pricing structure

4. **quotes:** Customer quotation records
   - Client contact information
   - Configuration stored as JSON string
   - Product type and use type metadata
   - Total price snapshot

**Data Access Pattern:**
Storage abstraction layer (`server/storage.ts`) implements IStorage interface:
- Separates business logic from database operations
- DatabaseStorage class provides CRUD methods
- Uses Drizzle's query builder for all operations
- Returns typed entities matching schema definitions

### Authentication & Authorization

**Current Implementation:**
Mock password authentication for admin panel (`password === "admin123"`)

**Production Requirements:**
System requires implementation of proper authentication:
- Session management (connect-pg-simple package already included)
- Password hashing
- Role-based access control
- JWT or session tokens

### External Dependencies

**UI Component Libraries:**
- @radix-ui/* primitives (18 packages) for accessible component foundations
- cmdk for command palette/search interfaces
- embla-carousel-react for image carousels
- lucide-react for icon system

**Form Management:**
- react-hook-form for form state
- @hookform/resolvers for validation
- zod for schema validation

**Utilities:**
- class-variance-authority for component variant management
- clsx + tailwind-merge (via cn() utility) for className composition
- date-fns for date manipulation
- jspdf for PDF generation (quote exports)

**Development Tools:**
- @replit/vite-plugin-* packages for Replit-specific development features
- tsx for TypeScript execution
- drizzle-kit for database migrations

**Database:**
- @neondatabase/serverless for PostgreSQL connection
- ws (WebSocket) required by Neon driver

**Critical Configuration Files:**
- `drizzle.config.ts`: Database connection and migration settings
- `vite.config.ts`: Build configuration with path aliases (@/, @shared/, @assets/)
- `tailwind.config.ts`: Custom design tokens and color system
- `tsconfig.json`: TypeScript compilation with path mappings

**Asset Management:**
Generated images stored in `attached_assets/generated_images/` referenced via Vite aliases