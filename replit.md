# Playground & Wooden House Quotation System

## Overview
This project is a modular quotation system for playground equipment and wooden houses, specifically designed for the Bolivian market (Mobiliario Urbano). It enables customers to configure custom products by selecting base platforms and adding modular components. A key feature is its real-time dynamic pricing, which adjusts based on the usage type (domestic vs. public/institutional) and the selected platform size. The system includes an admin panel for managing inventory, content, and quotes, and it generates exportable PDF quotations. All prices are displayed in Bolivianos (Bs).

The project aims to simplify the quotation process for complex modular products, providing accurate pricing instantly and allowing for easy management of product offerings and website content.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for server state.
- **Styling**: Tailwind CSS with a custom design system based on Material Design principles, utilizing HSL-based CSS variables for theming and light/dark mode.
- **Components**: shadcn/ui library (New York variant) built on Radix UI primitives.
- **State Management**: TanStack Query for server data, `useState` for local UI state.
- **Key User Flows**:
    - **Home**: Dynamic content via CMS.
    - **Configurator**: Multi-step process for platform and module selection with dynamic pricing.
    - **Gallery**: CMS-managed project showcase.
    - **Admin Panel**: Password-protected CRUD operations for platforms, modules, site content, hero carousel, gallery images, and customer quotations.

### Backend
- **Runtime**: Node.js with Express.js (TypeScript, ESM modules).
- **API**: RESTful API using JSON, prefixed with `/api/`. Includes endpoints for managing platforms, modules, houses, and creating quotes. Error handling returns appropriate HTTP status codes.
- **Data Validation**: Zod schemas used for request validation.

### Data Layer
- **Database**: PostgreSQL via Neon serverless driver.
- **ORM**: Drizzle ORM for type-safe query building and migrations.
- **Schema**:
    - `platforms`: Unified table for playground and house structures, including category, dimensions, and separate pricing for domestic/public use.
    - `modules`: Add-on components with categorization and product type. Prices adjust dynamically based on platform size.
    - `site_content`: CMS table for all editable website text content, organized by sections.
    - `gallery_images`: CMS table for managing gallery images with ordering.
    - `hero_carousel_images`: Manages images for the automatic hero section background carousel, with ordering and enable/disable flags.
    - `quotes`: Stores customer quotation records including client info, configuration, and total price.
- **Data Access**: Storage abstraction layer (`server/storage.ts`) using Drizzle for CRUD operations.

### Authentication & Authorization
- **Current**: Mock password authentication for admin panel.
- **Future Requirement**: Implement robust authentication with session management (connect-pg-simple), password hashing, and role-based access control.

### Pricing Logic
- **Dynamic Module Pricing**: Modules have base prices that are dynamically adjusted based on the selected platform's size.
    - **Playgrounds**: Base price is for 1m x 1m platforms (100cm). Fixed multipliers:
        - 80cm: 0.8x
        - 100cm: 1.0x (base)
        - 120cm/150cm: 1.2x
    - **Casitas (Houses)**: Base price is for 1m x 1m houses (1 mt2). Prices calculated by **actual area**:
        - Formula: `precio_modulo = precio_base × área_casa`
        - Examples:
            - 1x1m (1 mt2): 1.0x (base)
            - 1.5x1.5m (2.25 mt2): 2.25x
            - 2x2m (4 mt2): 4.0x
            - 2.5x2.5m (6.25 mt2): 6.25x
            - 3x3m (9 mt2): 9.0x
- The system automatically calculates adjusted prices; admins only manage base prices per mt2 (1x1m base).

### Image Management
- **Storage**: PostgreSQL (Neon) database storage using bytea type for binary image data. Solves Railway's ephemeral filesystem persistence problem.
- **Upload**: Custom `ObjectUploader` component uploads images via FormData to `/api/upload-image` endpoint using multer (memoryStorage).
- **Serving**: Images served from `/api/product-images/:id` endpoint with proper cache headers.
- **Limits**: Maximum 1MB per image, 100 images total (enforced at upload).
- **Database Table**: `product_images` stores filename, mimeType, byteLength, and binary data (bytea).
- **Caching**: Response headers include Cache-Control (public, max-age=86400) and Content-Type matching uploaded MIME type.
- **Display**: Images displayed with consistent sizing and aspect ratios across the application.
- **Legacy Format**: Old `/uploads/{filename}` URLs from filesystem storage are deprecated (images lost on Railway redeploys).

## External Dependencies

- **UI Component Libraries**: @radix-ui/*, cmdk, embla-carousel-react, lucide-react.
- **Form Management**: react-hook-form, @hookform/resolvers, zod.
- **Utilities**: class-variance-authority, clsx, tailwind-merge, date-fns, jspdf.
- **Database**: @neondatabase/serverless, ws.
- **Development Tools**: @replit/vite-plugin-*, tsx, drizzle-kit.

## Recent Changes

**October 27, 2025 - House Configurator Size Display Fix:**
- Fixed issue where house platform sizes were not displaying in the configurator
- Problem: Code was trying to access non-existent `item.size` field
- Solution: Both playgrounds and houses now correctly use `item.height` field from database
- Verified: House sizes (e.g., "2m x 2m") now display correctly with prices
- End-to-end testing confirmed correct display for both domestic and public pricing

**October 27, 2025 - Gallery Price Feature:**
- Added `price` field to `gallery_images` table (integer, nullable)
- Updated Admin panel Gallery tab:
  - Added editable price input field (Bs) for each gallery image
  - Added editable title field with auto-save on change
  - Improved layout with labels and better spacing
- Updated public Gallery page:
  - Display price in Bolivianos (Bs) format below description
  - Price shown with separator (e.g., "Bs 1.500")
  - Only displays price if value is set
- Created `updateGalleryImageMutation` for updating gallery images
- Database migration applied successfully

**October 27, 2025 - Hero Carousel Implementation:**
- Created `hero_carousel_images` database table with fields: imageUrl, order, enabled
- Implemented complete storage CRUD operations in server/storage.ts
- Added API routes: GET/POST/PATCH/DELETE for `/api/hero-carousel-images`
- Updated Hero.tsx component with automatic carousel display:
  - Fetches enabled carousel images from API
  - Auto-advances every 5 seconds with smooth 1000ms fade transitions
  - Falls back to single `hero_image_url` from CMS when carousel is empty
  - Fixed height at 600px for consistent display
  - Proper z-layering: background images (z:0) → gradient overlay (z:1) → content (z:10)
- Added "Carrusel Hero" tab in Admin panel (6 tabs total):
  - Upload new carousel images via ObjectUploader
  - Toggle enabled/disabled status per image (visual indicator overlay for disabled)
  - Delete carousel images
  - Display order field for controlling sequence
  - Grid layout showing all carousel images with management controls
- Bug fix: Added index clamping to prevent crash when images are disabled/deleted during carousel rotation
  - useEffect resets currentImageIndex to 0 when it exceeds array bounds
  - Safety check before accessing activeImages[currentImageIndex]
- End-to-end testing: ✅ Passed (hero background renders correctly, admin panel functional)
- Architect review: ✅ Approved (no critical issues, ready for production)

**October 27, 2025 - Full CMS Implementation with Save/Cancel Buttons:**
- Replaced auto-save behavior with explicit save (green ✓) and cancel (red ✗) buttons
- Buttons only appear when content differs from saved value
- Applied pattern across all CMS text editing: Hero, Features, Products, CTA, Contact sections
- Fixed hero image upload: created `/api/objects/upload-public` endpoint, images serve via `/public/` route
- Images now use local URL format `/public/{filename}` instead of Google Storage URLs
- Gallery management system with image upload and deletion
- All website text content fully editable through Admin panel organized by semantic sections

**October 27, 2025 - Migration to Local Filesystem Storage:**
- Migrated from Replit Object Storage (Google Cloud) to local filesystem storage for Railway compatibility
- Created `/api/upload-image` endpoint using multer middleware to handle file uploads
- Images saved to `public/uploads/` directory and served via Express static middleware at `/uploads/` path
- Updated `ObjectUploader` component to use FormData POST requests instead of signed URL uploads
- Removed `onGetUploadParameters` prop requirement from ObjectUploader interface
- All 5 ObjectUploader instances in Admin panel updated to new simplified API
- Added `public/uploads/*` to .gitignore to exclude uploaded images from version control
- Image URLs now use simple format: `/uploads/{filename}` instead of Google Storage URLs
- Added multer error handler middleware to return 400 status codes for validation errors (file size/type)
- End-to-end testing: ✅ Passed (admin panel loads, all tabs functional, no console errors)
- Architect review: ✅ Approved (functions as intended, Railway compatible, security recommendations noted)

**October 28, 2025 - House Module Pricing by Actual Area:**
- Updated module pricing logic for houses (casitas) to calculate by actual area in mt2 instead of fixed multipliers
- Implemented area-based calculation: `module_price = base_price × house_area`
- Base area reference: 1x1m = 1 mt2 (factor 1.0)
- Examples: 1x1m = 1.0x, 1.5x1.5m (2.25 mt2) = 2.25x, 2x2m (4 mt2) = 4.0x, 3x3m (9 mt2) = 9.0x
- Added 1x1m house platform with price Bs 3.200 (domestic) as base reference
- Playground pricing unchanged (still uses fixed multipliers based on height)
- Modified `getPlatformMultiplier()` function in `shared/pricing.ts` to branch by platform category
- Added `calculateHouseAreaM2()` helper function for area calculation

**October 28, 2025 - Migration to Neon PostgreSQL Image Storage:**
- **Migration**: Moved from local filesystem (`public/uploads/`) to PostgreSQL (Neon) database storage for images
- **Reason**: Railway's ephemeral filesystem deletes images on every redeploy; database storage ensures persistence
- **Implementation**:
  - Created `product_images` table with custom bytea type (Drizzle ORM customType for binary data)
  - Fields: id (UUID), filename, mimeType, byteLength, data (bytea), createdAt
  - Changed multer from diskStorage to memoryStorage (files buffered in RAM before DB insert)
  - Updated `/api/upload-image` endpoint to save images to database
  - Created GET `/api/product-images/:id` endpoint to serve images with streaming and cache headers
  - Storage interface: Added getProductImage, createProductImage, deleteProductImage, getProductImagesCount methods
- **Limits & Safeguards**:
  - Per-image limit: 1MB maximum (down from previous 10MB to optimize DB size)
  - Total limit: 100 images maximum (prevents database bloat, ~50MB total estimated)
  - Validation: MIME type check (image/* only), file size enforcement
- **Cache Strategy**:
  - Cache-Control: `public, max-age=86400` (1 day browser cache)
  - Content-Type header matches uploaded image MIME type
  - Content-Length header set for proper client handling
- **Image URL Format**:
  - New format: `/api/product-images/{uuid}` (database-backed)
  - Old format: `/uploads/{filename}` (deprecated, filesystem-backed - images lost)
- **Database Schema Change**: Applied via `npm run db:push` successfully
- **End-to-end testing**: ✅ Passed
  - Images upload to database correctly
  - Images serve from `/api/product-images/:id` with proper headers
  - Configurator displays images correctly
  - Cache headers working as expected
- **Architect review**: ✅ Approved
  - Implementation correct and efficient
  - Safeguards appropriate for scale (<100 images, <1MB each)
  - Suggested improvements (optional): ETag/Last-Modified headers, migration script for legacy URLs
- **Known Issue**: Old platform/module records with `/uploads/*` URLs will show broken images (expected - filesystem images don't persist across Railway redeploys)
