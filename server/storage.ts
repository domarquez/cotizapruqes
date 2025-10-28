import { type Platform, type Module, type Quote, type SiteContent, type GalleryImage, type HeroCarouselImage, type ProductImage, type InsertPlatform, type InsertModule, type InsertQuote, type InsertSiteContent, type InsertGalleryImage, type InsertHeroCarouselImage, type InsertProductImage } from "@shared/schema";
import { platforms, modules, quotes, siteContent, galleryImages, heroCarouselImages, productImages } from "@shared/schema";
import { db } from "./db";
import { eq, asc, count, sql } from "drizzle-orm";

export interface IStorage {
  // Platforms
  getPlatforms(): Promise<Platform[]>;
  getPlatform(id: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: string, platform: Partial<InsertPlatform>): Promise<Platform>;
  deletePlatform(id: string): Promise<void>;
  
  // Modules
  getModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<Module>;
  deleteModule(id: string): Promise<void>;
  
  // Quotes
  getQuotes(): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  // Site Content
  getSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  
  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<void>;
  
  // Hero Carousel Images
  getHeroCarouselImages(): Promise<HeroCarouselImage[]>;
  getHeroCarouselImage(id: string): Promise<HeroCarouselImage | undefined>;
  createHeroCarouselImage(image: InsertHeroCarouselImage): Promise<HeroCarouselImage>;
  updateHeroCarouselImage(id: string, image: Partial<InsertHeroCarouselImage>): Promise<HeroCarouselImage>;
  deleteHeroCarouselImage(id: string): Promise<void>;
  
  // Product Images
  getProductImage(id: string): Promise<ProductImage | undefined>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  deleteProductImage(id: string): Promise<void>;
  getProductImagesCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Platforms
  async getPlatforms(): Promise<Platform[]> {
    return await db.select().from(platforms);
  }

  async getPlatform(id: string): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));
    return platform || undefined;
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db
      .insert(platforms)
      .values(insertPlatform)
      .returning();
    return platform;
  }

  async updatePlatform(id: string, updateData: Partial<InsertPlatform>): Promise<Platform> {
    const [platform] = await db
      .update(platforms)
      .set(updateData)
      .where(eq(platforms.id, id))
      .returning();
    return platform;
  }

  async deletePlatform(id: string): Promise<void> {
    await db.delete(platforms).where(eq(platforms.id, id));
  }

  // Modules
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values(insertModule)
      .returning();
    return module;
  }

  async updateModule(id: string, updateData: Partial<InsertModule>): Promise<Module> {
    const [module] = await db
      .update(modules)
      .set(updateData)
      .where(eq(modules.id, id))
      .returning();
    return module;
  }

  async deleteModule(id: string): Promise<void> {
    await db.delete(modules).where(eq(modules.id, id));
  }

  // Quotes
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes);
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  // Site Content
  async getSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content || undefined;
  }

  async upsertSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const existing = await this.getSiteContentByKey(insertContent.key);
    
    if (existing) {
      const [updated] = await db
        .update(siteContent)
        .set({ 
          value: insertContent.value,
          type: insertContent.type,
          section: insertContent.section,
          updatedAt: new Date().toISOString()
        })
        .where(eq(siteContent.key, insertContent.key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteContent)
        .values(insertContent)
        .returning();
      return created;
    }
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(asc(galleryImages.order));
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return image || undefined;
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db
      .insert(galleryImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async updateGalleryImage(id: string, updateData: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [image] = await db
      .update(galleryImages)
      .set(updateData)
      .where(eq(galleryImages.id, id))
      .returning();
    return image;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Hero Carousel Images
  async getHeroCarouselImages(): Promise<HeroCarouselImage[]> {
    return await db.select().from(heroCarouselImages).orderBy(asc(heroCarouselImages.order));
  }

  async getHeroCarouselImage(id: string): Promise<HeroCarouselImage | undefined> {
    const [image] = await db.select().from(heroCarouselImages).where(eq(heroCarouselImages.id, id));
    return image || undefined;
  }

  async createHeroCarouselImage(insertImage: InsertHeroCarouselImage): Promise<HeroCarouselImage> {
    const [image] = await db
      .insert(heroCarouselImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async updateHeroCarouselImage(id: string, updateData: Partial<InsertHeroCarouselImage>): Promise<HeroCarouselImage> {
    const [image] = await db
      .update(heroCarouselImages)
      .set(updateData)
      .where(eq(heroCarouselImages.id, id))
      .returning();
    return image;
  }

  async deleteHeroCarouselImage(id: string): Promise<void> {
    await db.delete(heroCarouselImages).where(eq(heroCarouselImages.id, id));
  }

  // Product Images
  async getProductImage(id: string): Promise<ProductImage | undefined> {
    const [image] = await db.select().from(productImages).where(eq(productImages.id, id));
    return image || undefined;
  }

  async createProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    const [image] = await db
      .insert(productImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async deleteProductImage(id: string): Promise<void> {
    await db.delete(productImages).where(eq(productImages.id, id));
  }

  async getProductImagesCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(productImages);
    return result?.count || 0;
  }
}

export const storage = new DatabaseStorage();
