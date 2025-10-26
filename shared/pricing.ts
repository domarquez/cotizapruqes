import type { Platform, Module } from "./schema";

/**
 * Multipliers for PLAYGROUND module pricing based on platform height (heightCm)
 * Base pricing in database is for 1m x 1m platforms (100cm height)
 * 
 * - 80cm platforms: 0.8x multiplier (smaller, cheaper modules)
 * - 100cm platforms: 1.0x multiplier (base price)
 * - 120cm+ platforms: 1.2x multiplier (larger, more expensive modules)
 */
const PLAYGROUND_MULTIPLIERS: Record<number, number> = {
  80: 0.8,
  100: 1.0,
  120: 1.2,
  150: 1.2,
};

/**
 * Multipliers for HOUSE module pricing based on house size (heightCm)
 * Base pricing in database is for 2m x 2m houses (200cm)
 * 
 * - 150cm (1.5x1.5m): 0.75x multiplier (smaller house)
 * - 200cm (2x2m): 1.0x multiplier (base price)
 * - 250cm (2.5x2.5m): 1.25x multiplier (larger house)
 * - 300cm (3x3m): 1.5x multiplier (largest house)
 */
const HOUSE_MULTIPLIERS: Record<number, number> = {
  150: 0.75,  // 1.5x1.5m
  200: 1.0,   // 2x2m (BASE)
  250: 1.25,  // 2.5x2.5m
  300: 1.5,   // 3x3m
};

const DEFAULT_MULTIPLIER = 1.0;

/**
 * Get the pricing multiplier for a given platform
 * @param platform The selected platform (optional)
 * @returns The multiplier value based on platform category
 */
export function getPlatformMultiplier(platform?: Platform | null): number {
  if (!platform) return DEFAULT_MULTIPLIER;
  
  // Use different multiplier tables based on platform category
  const multipliers = platform.category === "house" 
    ? HOUSE_MULTIPLIERS 
    : PLAYGROUND_MULTIPLIERS;
  
  return multipliers[platform.heightCm] ?? DEFAULT_MULTIPLIER;
}

/**
 * Calculate the adjusted price for a module based on platform size
 * @param module The module to price
 * @param platform The selected platform (optional)
 * @param useType The usage type (domestic or public)
 * @returns The adjusted price in the same format as stored in database
 */
export function getAdjustedModulePrice(
  module: Module,
  platform: Platform | null | undefined,
  useType: "domestic" | "public"
): number {
  const multiplier = getPlatformMultiplier(platform);
  const basePrice = useType === "domestic" 
    ? parseFloat(module.priceDomestic) 
    : parseFloat(module.pricePublic);
  
  return Math.round(basePrice * multiplier);
}

/**
 * Get a human-readable description of the platform size category
 * @param platform The platform
 * @returns A description string
 */
export function getPlatformSizeCategory(platform?: Platform | null): string {
  if (!platform) return "Base";
  
  const multiplier = getPlatformMultiplier(platform);
  if (multiplier < 1.0) return "Pequeña";
  if (multiplier > 1.0) return "Grande";
  return "Base";
}
