import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const platforms = pgTable("platforms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  height: text("height").notNull(),
  heightCm: integer("height_cm").notNull(),
  priceDomestic: decimal("price_domestic", { precision: 10, scale: 2 }).notNull(),
  pricePublic: decimal("price_public", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull().default("playground"),
  imageUrl: text("image_url"),
});

export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  materialPublic: text("material_public").notNull(),
  priceDomestic: decimal("price_domestic", { precision: 10, scale: 2 }).notNull(),
  pricePublic: decimal("price_public", { precision: 10, scale: 2 }).notNull(),
  productType: text("product_type").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  productType: text("product_type").notNull(),
  useType: text("use_type").notNull(),
  configuration: text("configuration").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
  section: text("section").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price"),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const heroCarouselImages = pgTable("hero_carousel_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertPlatformSchema = createInsertSchema(platforms).omit({ id: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true });
export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true, updatedAt: true });
export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({ id: true, createdAt: true });
export const insertHeroCarouselImageSchema = createInsertSchema(heroCarouselImages).omit({ id: true, createdAt: true });

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type HeroCarouselImage = typeof heroCarouselImages.$inferSelect;
export type InsertHeroCarouselImage = z.infer<typeof insertHeroCarouselImageSchema>;
