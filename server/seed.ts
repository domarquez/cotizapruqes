import { storage } from "./storage";

async function seedContent() {
  console.log("🌱 Seeding site content...");
  
  // Hero Section
  await storage.upsertSiteContent({
    key: "hero_title",
    value: "Parques Infantiles y Casas de Madera Premium",
    type: "text",
    section: "hero"
  });

  await storage.upsertSiteContent({
    key: "hero_subtitle",
    value: "Diseños personalizados para espacios de juego seguros y duraderos. Fabricación boliviana con materiales de primera calidad.",
    type: "text",
    section: "hero"
  });

  await storage.upsertSiteContent({
    key: "hero_cta_text",
    value: "Configurar Mi Parque",
    type: "text",
    section: "hero"
  });

  // Features Section
  await storage.upsertSiteContent({
    key: "features_title",
    value: "¿Por qué elegirnos?",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "features_subtitle",
    value: "Más de 10 años creando espacios de juego seguros y duraderos",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_1_title",
    value: "Calidad Premium",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_1_description",
    value: "Madera tratada de primera calidad con garantía extendida",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_2_title",
    value: "Personalización Total",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_2_description",
    value: "Sistema modular que se adapta a tus necesidades y presupuesto",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_3_title",
    value: "Instalación Profesional",
    type: "text",
    section: "features"
  });

  await storage.upsertSiteContent({
    key: "feature_3_description",
    value: "Equipo especializado con instalación incluida en el precio",
    type: "text",
    section: "features"
  });

  // Products Section
  await storage.upsertSiteContent({
    key: "products_title",
    value: "Nuestros Productos",
    type: "text",
    section: "products"
  });

  // CTA Section
  await storage.upsertSiteContent({
    key: "cta_title",
    value: "¿Listo para comenzar?",
    type: "text",
    section: "cta"
  });

  await storage.upsertSiteContent({
    key: "cta_description",
    value: "Usa nuestro configurador para diseñar tu parque ideal y obtener una cotización instantánea",
    type: "text",
    section: "cta"
  });

  await storage.upsertSiteContent({
    key: "cta_button_text",
    value: "Configurar Ahora",
    type: "text",
    section: "cta"
  });

  // Contact Info
  await storage.upsertSiteContent({
    key: "contact_phone",
    value: "+591 XXXX-XXXX",
    type: "text",
    section: "contact"
  });

  await storage.upsertSiteContent({
    key: "contact_email",
    value: "contacto@mobiliariourbano.com",
    type: "text",
    section: "contact"
  });

  await storage.upsertSiteContent({
    key: "contact_address",
    value: "Santa Cruz, Bolivia",
    type: "text",
    section: "contact"
  });

  console.log("✅ Site content seeded successfully!");
}

seedContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error seeding content:", error);
    process.exit(1);
  });
