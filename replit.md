# Playground & Wooden House Quotation System

## Overview
This project is a modular quotation system for playground equipment and wooden houses, specifically for the Bolivian market. It enables customers to configure products by selecting base platforms and adding modular components. The system features real-time dynamic pricing based on usage type (domestic vs. public/institutional) and platform size, with all prices in Bolivianos (Bs). It includes an admin panel for managing inventory, content, and quotes, and generates exportable PDF quotations. The primary goal is to streamline the quotation process for complex modular products, ensure accurate pricing, and facilitate easy management of product offerings and website content.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for server state.
- **Styling**: Tailwind CSS with a custom design system based on Material Design principles, utilizing HSL-based CSS variables for theming and light/dark mode.
- **Components**: shadcn/ui library (New York variant) built on Radix UI primitives.
- **State Management**: TanStack Query for server data, `useState` for local UI state.
- **Key User Flows**: Home (CMS dynamic content), Configurator (multi-step product and pricing selection), Gallery (CMS-managed showcase), Admin Panel (CRUD for platforms, modules, content, quotes).
- **UI/UX Decisions**: Progressive disclosure wizard flow for mobile configurator, visual step indicators, auto-scroll, fully responsive design with vertical stacking on mobile, and responsive handling for category selection (dropdown on mobile, horizontal tabs on desktop).

### Backend
- **Runtime**: Node.js with Express.js (TypeScript, ESM modules).
- **API**: RESTful API using JSON, prefixed with `/api/`, with Zod schemas for request validation.

### Data Layer
- **Database**: PostgreSQL via Neon serverless driver.
- **ORM**: Drizzle ORM for type-safe query building and migrations.
- **Schema**: Tables for `platforms`, `modules`, `site_content`, `gallery_images`, `hero_carousel_images`, `quotes`, `product_images`, and `featured_products`.
- **Data Access**: Storage abstraction layer (`server/storage.ts`) for CRUD operations.

### Authentication & Authorization
- **Current**: Mock password authentication for admin panel.
- **Future**: Robust authentication with session management and role-based access control.

### Pricing Logic
- **Dynamic Module Pricing**: Base prices adjust based on platform size and type.
    - **Playgrounds**: Multipliers based on platform height (e.g., 100cm = 1.0x, 80cm = 0.8x).
    - **Casitas (Houses)**: Category-specific pricing rules:
        - **Barandas and Techos**: Multiplied by actual area in m².
        - **Resbalines**: Base price + 20%.
        - **Columpios and Trepadoras**: Base price + 30%.
        - **Other categories**: Base price without multiplier.
- Admins manage only base prices.

### Image Management
- **Storage**: PostgreSQL (Neon) database using `bytea` type for persistence.
- **Upload**: Custom `ObjectUploader` component uploads images via FormData to `/api/upload-image` endpoint using multer (memoryStorage).
- **Serving**: Images served from `/api/product-images/:id` endpoint with cache headers.
- **Limits**: Max 1MB per image, 100 images total.

## External Dependencies

- **UI Component Libraries**: @radix-ui/*, cmdk, embla-carousel-react, lucide-react.
- **Form Management**: react-hook-form, @hookform/resolvers, zod.
- **Utilities**: class-variance-authority, clsx, tailwind-merge, date-fns, jspdf.
- **Database**: @neondatabase/serverless, ws.
- **Development Tools**: @replit/vite-plugin-*, tsx, drizzle-kit.