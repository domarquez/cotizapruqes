import { type Platform, type Module, type House, type Quote, type InsertPlatform, type InsertModule, type InsertHouse, type InsertQuote } from "@shared/schema";
import { platforms, modules, houses, quotes } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  
  // Houses
  getHouses(): Promise<House[]>;
  getHouse(id: string): Promise<House | undefined>;
  createHouse(house: InsertHouse): Promise<House>;
  updateHouse(id: string, house: Partial<InsertHouse>): Promise<House>;
  deleteHouse(id: string): Promise<void>;
  
  // Quotes
  getQuotes(): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
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

  // Houses
  async getHouses(): Promise<House[]> {
    return await db.select().from(houses);
  }

  async getHouse(id: string): Promise<House | undefined> {
    const [house] = await db.select().from(houses).where(eq(houses.id, id));
    return house || undefined;
  }

  async createHouse(insertHouse: InsertHouse): Promise<House> {
    const [house] = await db
      .insert(houses)
      .values(insertHouse)
      .returning();
    return house;
  }

  async updateHouse(id: string, updateData: Partial<InsertHouse>): Promise<House> {
    const [house] = await db
      .update(houses)
      .set(updateData)
      .where(eq(houses.id, id))
      .returning();
    return house;
  }

  async deleteHouse(id: string): Promise<void> {
    await db.delete(houses).where(eq(houses.id, id));
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
}

export const storage = new DatabaseStorage();
