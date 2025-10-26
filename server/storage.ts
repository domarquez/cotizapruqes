import { type Platform, type Module, type House, type Quote, type InsertPlatform, type InsertModule, type InsertHouse, type InsertQuote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Platforms
  getPlatforms(): Promise<Platform[]>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  
  // Modules
  getModules(): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Houses
  getHouses(): Promise<House[]>;
  createHouse(house: InsertHouse): Promise<House>;
  
  // Quotes
  getQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
}

export class MemStorage implements IStorage {
  private platforms: Map<string, Platform>;
  private modules: Map<string, Module>;
  private houses: Map<string, House>;
  private quotes: Map<string, Quote>;

  constructor() {
    this.platforms = new Map();
    this.modules = new Map();
    this.houses = new Map();
    this.quotes = new Map();
  }

  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = randomUUID();
    const platform: Platform = { 
      ...insertPlatform, 
      id,
      category: insertPlatform.category || "playground"
    };
    this.platforms.set(id, platform);
    return platform;
  }

  async getModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = randomUUID();
    const module: Module = { 
      ...insertModule, 
      id,
      description: insertModule.description || null
    };
    this.modules.set(id, module);
    return module;
  }

  async getHouses(): Promise<House[]> {
    return Array.from(this.houses.values());
  }

  async createHouse(insertHouse: InsertHouse): Promise<House> {
    const id = randomUUID();
    const house: House = { ...insertHouse, id };
    this.houses.set(id, house);
    return house;
  }

  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const quote: Quote = { 
      ...insertQuote, 
      id, 
      createdAt,
      clientPhone: insertQuote.clientPhone || null
    };
    this.quotes.set(id, quote);
    return quote;
  }
}

export const storage = new MemStorage();
