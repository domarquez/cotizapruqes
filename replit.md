# Playground & Wooden House Quotation System

## Overview
This project is a modular quotation system for playground equipment and wooden houses, tailored for the Bolivian market. It allows customers to configure custom products by selecting base platforms and adding modular components. The system features real-time dynamic pricing based on usage type (domestic vs. public/institutional) and platform size. It includes an admin panel for managing inventory, content, and quotes, and generates exportable PDF quotations. All prices are in Bolivianos (Bs). The project aims to streamline the quotation process for complex modular products, ensuring accurate pricing and easy management of product offerings and website content.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for server state.
- **Styling**: Tailwind CSS with a custom design system based on Material Design principles, utilizing HSL-based CSS variables for theming and light/dark mode.
- **Components**: shadcn/ui library (New York variant) built on Radix UI primitives.
- **State Management**: TanStack Query for server data, `useState` for local UI state.
- **Key User Flows**: Home (CMS dynamic content), Configurator (multi-step product and pricing selection), Gallery (CMS-managed showcase), Admin Panel (CRUD for platforms, modules, content, quotes).
- **UI/UX Decisions**: Progressive disclosure wizard flow for mobile configurator, visual step indicators, auto-scroll, fully responsive design with vertical stacking on mobile (< 640px).

### Backend
- **Runtime**: Node.js with Express.js (TypeScript, ESM modules).
- **API**: RESTful API using JSON, prefixed with `/api/`, with Zod schemas for request validation.

### Data Layer
- **Database**: PostgreSQL via Neon serverless driver.
- **ORM**: Drizzle ORM for type-safe query building and migrations.
- **Schema**: Tables for `platforms`, `modules`, `site_content`, `gallery_images`, `hero_carousel_images`, `quotes`, and `product_images`.
- **Data Access**: Storage abstraction layer (`server/storage.ts`) for CRUD operations.

### Authentication & Authorization
- **Current**: Mock password authentication for admin panel.
- **Future**: Robust authentication with session management and role-based access control.

### Pricing Logic
- **Dynamic Module Pricing**: Base prices adjust based on platform size and type.
    - **Playgrounds**: Multipliers based on platform height (e.g., 100cm = 1.0x, 80cm = 0.8x).
    - **Casitas (Houses)**: Category-specific pricing rules:
        - **Barandas and Techos**: Multiplied by actual area in m² (e.g., 1×1m = 1.0x, 2×2m = 4.0x)
        - **Resbalines**: Base price + 20% for all house models (height adjustment, NOT m²-based)
        - **Columpios and Trepadoras**: Base price + 30% for all house models (NOT m²-based)
        - **Other categories**: Base price without multiplier
- Admins manage only base prices.

### Image Management
- **Storage**: PostgreSQL (Neon) database using `bytea` type for persistence, solving ephemeral filesystem issues.
- **Upload**: Custom `ObjectUploader` component uploads images via FormData to `/api/upload-image` endpoint using multer (memoryStorage).
- **Serving**: Images served from `/api/product-images/:id` endpoint with cache headers.
- **Limits**: Max 1MB per image, 100 images total.
- **Database Table**: `product_images` stores filename, mimeType, byteLength, and binary data.

## External Dependencies

- **UI Component Libraries**: @radix-ui/*, cmdk, embla-carousel-react, lucide-react.
- **Form Management**: react-hook-form, @hookform/resolvers, zod.
- **Utilities**: class-variance-authority, clsx, tailwind-merge, date-fns, jspdf.
- **Database**: @neondatabase/serverless, ws.
- **Development Tools**: @replit/vite-plugin-*, tsx, drizzle-kit.

## Recent Changes

**October 29, 2025 - Implemented Category-Specific Pricing for Casitas:**
- **Problem**: All casita modules were multiplied by m² area, but some modules need different pricing logic
- **User Request**: Different pricing rules per module category:
  - Barandas and Techos: Keep m²-based multiplication
  - Resbalines: Unit price + 20% (height adjustment, not area-based)
  - Columpios and Trepadoras: Unit price + 30% (not area-based)
- **Solution**: Modified `getAdjustedModulePrice()` in `shared/pricing.ts` to branch by module category for house platforms
- **Implementation**:
  ```typescript
  if (platform?.category === "house") {
    if (module.category === "barandas" || module.category === "techos") {
      return Math.round(basePrice * areaMultiplier); // m²-based
    }
    if (module.category === "resbalines") {
      return Math.round(basePrice * 1.2); // +20%
    }
    if (module.category === "columpios" || module.category === "trepadoras") {
      return Math.round(basePrice * 1.3); // +30%
    }
    return Math.round(basePrice); // Other categories: base price
  }
  ```
- **Benefits**:
  - Accurate pricing for different module types
  - Resbalines reflect height adjustment cost, not area
  - Columpios/Trepadoras have fixed markup regardless of house size
  - Barandas/Techos still scale appropriately with house dimensions
  - Playground pricing unchanged (height-based multipliers)
- **Verification**: E2E test confirmed:
  - 2×2m house: Techo = Bs 3,200 (×4), Resbalín = Bs 2,400 (×1.2), Columpio = Bs 780 (×1.3)
  - 1×1m house: Techo = Bs 800 (×1), Resbalín = Bs 2,400 (×1.2), Columpio = Bs 780 (×1.3)
  - Only area-dependent modules (Barandas/Techos) change with platform size
- **Architect review**: ✅ Approved - logic correct, E2E validated, suggests externalizing percentages for future configurability

**October 29, 2025 - Implemented Mobile Dropdown Menu for Module Categories:**
- **Problem**: Horizontal ScrollArea tabs in Step 4 pushed mobile layout off-screen despite responsive padding fixes
- **User Request**: Implement dropdown/overlay menu for categories to maintain responsive design on mobile
- **Solution**: Responsive dual-interface pattern for category selection
  - **Mobile (< 640px)**: shadcn Select dropdown component that overlays content
  - **Desktop (>= 640px)**: Horizontal scrollable tabs (original behavior)
  - Both interfaces share same `selectedCategory` state and module display logic
- **Implementation**:
  - Added `selectedCategory` state at component level
  - Moved `MODULE_CATEGORIES` and `modulesByCategory` logic to top of component
  - Added useEffect to reset category when productType/useType changes
  - Created responsive conditional rendering (sm:hidden / hidden sm:block)
  - Single module grid displays content from `modulesByCategory[selectedCategory]`
- **Benefits**:
  - Select overlay doesn't affect layout width (no horizontal overflow)
  - Clean mobile UX with native dropdown feel
  - Desktop experience unchanged (horizontal tabs preserved)
  - Automatic category filtering (only shows categories with modules, same as before)
- **Verification**: E2E test confirmed no horizontal overflow, dropdown works correctly, module content updates
- **Note**: Both old and new implementations filter empty categories - maintains existing behavior

**October 28, 2025 - Fixed Mobile Horizontal Overflow in All Configurator Steps:**
- **Problem**: Page overflowed horizontally by ~110px on mobile when Step 4 appeared after selecting platform in Step 3
- **Root Cause**: CardHeader and CardContent had default `p-6` (24px padding) which accumulated across nested cards, causing content width to exceed 375px mobile viewport
- **Solution**: Applied responsive horizontal padding to all configurator step Cards
  - Mobile (< 640px): `px-4` (16px horizontal padding)
  - Tablet+ (>= 640px): `px-6` (24px horizontal padding, original)
  - Added `min-w-0` to title containers for proper text wrapping
- **Changes Applied**: All 4 steps (Tipo de Uso, Tipo de Producto, Plataforma, Módulos) updated with responsive padding
- **Verification**: E2E test confirmed scrollWidth === clientWidth on mobile (375x667) across all steps
- **Architect review**: ✅ Approved - no regressions, improved mobile usability

**October 28, 2025 - Redesigned Category Selection with Horizontal Scroll:**
- **Problem**: Category tabs (techos, resbalines, columpios, etc.) overlapped with alert messages and module cards on both desktop and mobile
- **Root Cause**: Dynamic Tailwind grid classes (`grid-cols-${...}`) don't work at compile time; attempted to fit 8 categories causing layout collapse and z-index conflicts
- **Solution**: Replaced grid layout with horizontal ScrollArea
  - TabsList now uses `inline-flex` with horizontal scroll
  - All 8 categories accessible via smooth horizontal scrolling
  - Added horizontal ScrollBar for visibility on mobile
  - Removed problematic `relative z-10` that caused overlap
- **Benefits**: Clean predictable layout, no overlap with content below, works on all viewports
- **Verification**: E2E tests passed on desktop (1920x1080) and mobile (375x667)
- **Architect review**: ✅ Approved - recommends monitoring user feedback for scroll discoverability

**October 28, 2025 - Fixed Mobile Responsiveness in Configurator:**
- **Problem**: Horizontal overflow when selecting uso type on mobile viewports (<640px); Step 2 buttons exceeded viewport width
- **Root Cause**: Step 2 product-type buttons in horizontal flex layout (~478px combined width) overflowed 360px mobile viewport
- **Solution**: Changed Step 2 button container to responsive vertical stacking
  - Mobile (< 640px): Buttons stack vertically with `flex-col` 
  - Tablet+ (>= 640px): Buttons side-by-side with `flex-row`
- **Additional Fixes**: Added `min-w-0` to Step 1 cards, `flex-wrap` to CardTitle, `shrink-0` to text/badge elements
- **Verification**: E2E test confirmed no horizontal overflow (scrollWidth === clientWidth) at all steps
- **Architect review**: ✅ Approved - no accessibility, behavior, or maintainability concerns

**October 28, 2025 - Expanded Module Categories & Admin Editing:**
- **Problem**: Only 3 hardcoded module categories (techos, resbalines, accesorios) were available; categories couldn't be edited after module creation
- **Solution**: Expanded to 8 categories with dynamic tab rendering and inline editing in admin panel
- **Module Categories (8 total)**:
  - `techos` - Techos
  - `resbalines` - Resbalines
  - `columpios` - Columpios
  - `trepadoras` - Trepadoras
  - `barandas` - Barandas
  - `sube_y_baja` - Sube y Baja
  - `calistenia` - Calistenia
  - `accesorios` - Accesorios
- **Dynamic Category System**:
  - `MODULE_CATEGORIES` constant defines all available categories
  - Configurator dynamically renders tabs only for categories with modules (price > 0)
  - Empty categories automatically hidden from UI
  - First available category auto-selected as default
  - Tabs use horizontal ScrollArea for smooth scrolling across all 8 categories
  - No z-index conflicts or content overlap
  - Proper spacing (mt-6) ensures tabs never overlap with module content
- **Module Selection Reminder**:
  - Alert box placed after category tabs in Step 4: "¡No olvides seleccionar módulos!"
  - Guides users to explore categories above and add components
  - Styled with `bg-primary/5 border-primary/20` for subtle emphasis
  - Layout order: Category tabs → Reminder alert → Module cards
- **Admin Panel Enhancements**:
  - Added "Categoría" and "Tipo" columns to modules table
  - Inline editing via `<select>` dropdowns with immediate save on change
  - All 8 categories available in both table and "Add Module" dialog
  - Category and product type now editable after module creation
- **Edge Case Handling**:
  - When no modules available (all have price = 0), shows helpful Alert message
  - Message explains what's missing and guides user to continue or contact admin
  - Ensures Step 4 always actionable even with empty module list
- **End-to-end testing**: ✅ Passed (19/19 steps)
  - Dynamic tabs render correctly
  - Admin inline editing works
  - Reminder alert displays
  - Empty state fallback works
- **Architect review**: ✅ Approved (including fallback fix for empty categories)