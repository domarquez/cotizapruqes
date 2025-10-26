# Playground & Wooden House Quotation System

## Overview

A modular quotation system for playground equipment and wooden houses for the Bolivian market (Mobiliario Urbano). This web application allows customers to configure custom playground structures or wooden houses by selecting base platforms and adding modular components, with real-time pricing based on usage type (domestic vs. public/institutional). 

**Dynamic Pricing System:**
- Module prices in database are base prices for 1m x 1m platforms
- System automatically adjusts module pricing based on selected platform size:
  - 80cm platforms: modules cost 0.8x base price (20% discount)
  - 100cm platforms: modules cost 1.0x base price (base)
  - 120cm+ platforms: modules cost 1.2x base price (20% premium)
- Admin panel manages only base prices (1m x 1m); all other sizes calculate automatically
- Modules can only be selected after choosing a platform to ensure correct pricing

The system includes an admin panel for managing base inventory pricing, and generates quotations with client information that can be saved or exported as PDFs. All prices displayed in Bolivianos (Bs).

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
Three main tables defined in `shared/schema.ts`:

1. **platforms:** Unified table for both playground and house structures
   - category field: "playground" or "house"
   - height field: Display text (e.g., "80cm", "2x2m")
   - heightCm field: Numeric value for pricing calculations
   - Separate pricing for domestic vs. public use
   - Playground variants: 80cm to 150cm height
   - House variants: 1.5x1.5m to 3x3m (stored as 150cm to 300cm)
   - imageUrl field: Optional URL for product image (stored in Replit Object Storage)

2. **modules:** Add-on components (roofs, slides, walls, etc.)
   - Categorized (techos, resbalines, accesorios)
   - Material specifications (different for domestic/public)
   - Product type field: "playground" or "house" (informational)
   - Modules work with both platform categories
   - Price automatically adjusts based on selected platform size
   - imageUrl field: Optional URL for product image (stored in Replit Object Storage)

3. **quotes:** Customer quotation records
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
- Generated images stored in `attached_assets/generated_images/` referenced via Vite aliases
- Product images uploaded via Replit Object Storage integration
- Simplified ObjectUploader component in `client/src/components/ObjectUploader.tsx` (native file input, no Uppy Dashboard UI to avoid CSS dependency issues)

### Pricing Logic

**Dynamic Module Pricing (shared/pricing.ts):**
The application implements platform size-based pricing multipliers with **dual reference systems**:

**For PLAYGROUNDS (base: 1m x 1m = 100cm):**
```typescript
PLAYGROUND_MULTIPLIERS = {
  80: 0.8,   // Small platforms (80cm) - 20% discount
  100: 1.0,  // Base platforms (1m) - base price
  120: 1.2,  // Large platforms (120cm) - 20% premium
  150: 1.2   // Extra large platforms (1.5m) - 20% premium
}
```

**For HOUSES (base: 2m x 2m = 200cm):**
```typescript
HOUSE_MULTIPLIERS = {
  150: 0.75,  // 1.5x1.5m - 25% discount
  200: 1.0,   // 2x2m - base price
  250: 1.25,  // 2.5x2.5m - 25% premium
  300: 1.5    // 3x3m - 50% premium
}
```

**Implementation Details:**
- `getPlatformMultiplier(platform)`: Auto-selects correct multiplier table based on platform.category
- `getAdjustedModulePrice(module, platform, useType)`: Calculates final module price
- Applied in ConfiguratorPanel when rendering ModuleCards and calculating totals
- Modules reset when platform changes to prevent stale pricing
- useRef tracks previous platform to avoid resetting on data refetches

**Admin Workflow:**
1. Admin sets base module prices in admin panel:
   - For playground modules: base price for 1m x 1m platforms
   - For house modules: base price for 2m x 2m houses
2. Frontend automatically calculates adjusted prices for all other sizes
3. No need to manage multiple price points per module per platform size

### Image Management System

**Object Storage Integration:**
- Replit Object Storage (Google Cloud Storage backend) configured for product images
- Environment variables: `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`
- Storage files: `server/objectStorage.ts`, `server/objectAcl.ts`

**Upload Implementation:**
- Simplified custom ObjectUploader component (no Uppy Dashboard to avoid CSS import issues)
- Native file input with validation (images only, max 5MB)
- Upload flow: Request URL from backend → PUT file to object storage → Update database with URL
- API endpoints:
  - `POST /api/objects/upload` - Generate signed upload URL
  - `PATCH /api/platforms/:id/image` - Update platform image URL
  - `PATCH /api/modules/:id/image` - Update module image URL

**Display Implementation:**
- Platform images: Fixed height h-32 (128px) in configurator platform selection
- Module images: Fixed height h-40 (160px) in ModuleCard components
- All images use `object-cover` to maintain aspect ratio within fixed containers
- Images only display when `imageUrl` field is populated
- Admin panel shows 12x12 thumbnails with upload buttons in table rows

**Recent Changes (October 26, 2025):**
- Added `imageUrl` field to platforms and modules tables
- Implemented image upload functionality in Admin panel
- Updated ConfiguratorPanel to display platform images with uniform sizing
- Updated ModuleCard component to display module images with uniform sizing
- End-to-end testing confirmed: upload UI, image display, and layout consistency