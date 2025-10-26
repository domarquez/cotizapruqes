# Design Guidelines: Sistema de Cotización Modular de Parques Infantiles

## Design Approach

**Hybrid Approach**: Material Design system foundations combined with e-commerce product configurator patterns inspired by IKEA planners and modern SaaS tools like Linear for clean data presentation.

**Core Principle**: Build trust through clarity. This is a business tool for families and institutions investing in children's play equipment—design must communicate professionalism, transparency, and ease of use.

## Typography

**Font Families** (via Google Fonts):
- Primary: Inter (headings, UI elements, numbers) - weights 400, 500, 600, 700
- Secondary: Open Sans (body text, descriptions) - weights 400, 600

**Hierarchy**:
- Hero Headline: text-5xl md:text-6xl font-bold
- Section Headers: text-3xl md:text-4xl font-semibold
- Product Titles: text-xl font-semibold
- Module Names: text-lg font-medium
- Prices: text-2xl font-bold (featured), text-lg font-semibold (items)
- Body Text: text-base leading-relaxed
- Captions/Labels: text-sm font-medium uppercase tracking-wide

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, gap-4, m-6 (cards, buttons)
- Section padding: py-12 md:py-20, px-4 md:px-8
- Large breaks: my-16 md:my-24

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto
- Configurator workspace: max-w-6xl
- Content sections: max-w-5xl
- Form containers: max-w-2xl

**Grid Systems**:
- Product showcase: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Configurator layout: 2-column split (lg:grid-cols-[2fr,1fr]) - left: visual preview, right: options/pricing
- Module selection: grid-cols-2 md:grid-cols-4 gap-4

## Component Library

### Navigation
- Sticky top navigation with logo, main navigation links, and prominent "Cotizar Ahora" CTA button
- Breadcrumb trail within configurator showing: Tipo → Plataforma Base → Módulos Adicionales → Resumen

### Hero Section
Large hero with professional playground installation photo showing happy children, overlay with centered content:
- Main headline emphasizing "Diseña tu Parque Ideal"
- Subheadline explaining modular customization
- Two CTAs: primary "Comenzar Cotización" + secondary "Ver Galería"
- Trust indicators below: "635+ Proyectos Realizados" with small icons

### Product Cards (Gallery Section)
Elevated cards with:
- High-quality product photo (aspect-ratio-4/3)
- Category badge (small pill: "Parque Infantil" / "Casa de Madera")
- Title and brief description
- Starting price "Desde $XX.XXX"
- "Personalizar" button

### Configurator Interface (Main Application)

**Step Indicator**: Horizontal progress bar showing current step in configuration process

**Visual Preview Panel** (Left Side):
- Large canvas showing 3D-like illustration or composite image of selected modules
- Placeholder when empty: Dashed border with icon and "Agrega módulos para ver tu diseño"
- Module labels on hover showing component names

**Selection Panel** (Right Side):
- Collapsible sections for each module category
- Platform selector: Large buttons with height labels (80cm, 90cm, 1m, 1.20m, 1.50m) showing as pill buttons
- Module cards: Small cards with icon/image, name, material type, and price (+$XXX)
- Checkbox or toggle to add/remove modules
- Material selector: Dropdown or radio buttons (Madera, Plástico, Metal)

**Price Summary Sidebar** (Sticky):
- Fixed panel showing:
  - Running total in large text
  - Itemized list of selected modules with individual prices
  - Quantity adjusters for duplicate items
  - "Generar Cotización PDF" prominent button
  - "Guardar Configuración" secondary button

### Forms
- Input fields: rounded-lg border with focus ring
- Labels: font-medium text-sm mb-2
- Client information form (before PDF generation): Name, email, phone, notes
- Validation messages in small text below inputs

### Data Display
- Specification tables for modules: alternating row backgrounds
- Material comparison table: 3-column grid showing features
- Price breakdown: clean line items with aligned prices

### Buttons
- Primary CTA: Large rounded buttons with shadow, font-semibold
- Secondary: Outline style with hover fill transition
- Module add/remove: Icon buttons (plus/minus) with subtle backgrounds
- Quantity controls: Small +/- buttons flanking number display

### Admin Panel
Dashboard layout with:
- Sidebar navigation for different management sections
- Data tables for price management with inline editing
- Image upload zones for product photos (drag-and-drop or click)
- Form sections for adding new modules/materials

## Images

**Hero Section**: Full-width background image (1920x800px minimum) showing vibrant playground installation with children playing, mountains or green landscape background. Image should convey joy, safety, and quality craftsmanship.

**Product Gallery**: Multiple high-quality photos of completed installations (900x600px each):
- Wide shots showing full playground setups
- Detail shots of wooden craftsmanship
- Houses/cabins in natural settings
- Kids actively enjoying the equipment

**Configurator Preview**: Composite images or illustrated diagrams showing modular components that update based on selections. If using photos, show clean product shots on white/transparent backgrounds.

**Module Icons**: Simple line icons representing each module type (roof, slide, stairs, climbing wall, etc.) - use Heroicons library

**Trust Building**: Photos of installation process, team at work, satisfied families (in testimonials section if included)

## Special Interactions

**Module Selection**: Click card to add module → card highlights with checkmark, price animates into summary
**Quantity Changes**: Number increment with smooth transition, price updates with brief highlight effect
**Remove Module**: Swipe-to-delete on mobile, X button on desktop with confirmation
**PDF Generation**: Loading state with progress indicator, success message with download link
**Price Display**: Subtle pulse animation when total updates to draw attention

## Page Structure

1. **Landing/Home Page**: Hero → Benefits Grid (3 features) → Product Showcase Gallery → How It Works (3 steps) → CTA Section → Footer
2. **Configurator Page**: Breadcrumb → Step Indicator → Two-Column Layout (Preview | Selection) → Sticky Price Sidebar → Bottom CTA Bar (mobile)
3. **Galería Page**: Filterable grid of completed projects with lightbox view
4. **Admin Dashboard**: Sidebar + Main Content Area with tables and forms

## Responsive Behavior

- Mobile: Stack configurator to single column, preview on top, selections below, sticky price bar at bottom
- Tablet: Side-by-side where possible, collapsible panels
- Desktop: Full multi-column layouts, all panels visible

This design prioritizes clarity, trust, and ease of use while maintaining visual appeal through quality product photography and clean, modern interface patterns.