import type { Platform, Module } from "./schema";

/**
 * Multipliers for module pricing based on platform size (heightCm)
 * Base pricing in database is for 1m x 1m platforms (100cm)
 * 
 * - 80cm platforms: 0.8x multiplier (smaller, cheaper modules)
 * - 100cm platforms: 1.0x multiplier (base price)
 * - 120cm+ platforms: 1.2x multiplier (larger, more expensive modules)
 */
const PLATFORM_MULTIPLIERS: Record<number, number> = {
  80: 0.8,
  100: 1.0,
  120: 1.2,
  150: 1.2,
};

const DEFAULT_MULTIPLIER = 1.0;

/**
 * Get the pricing multiplier for a given platform
 * @param platform The selected platform (optional)
 * @returns The multiplier value (0.8, 1.0, or 1.2)
 */
export function getPlatformMultiplier(platform?: Platform | null): number {
  if (!platform) return DEFAULT_MULTIPLIER;
  return PLATFORM_MULTIPLIERS[platform.heightCm] ?? DEFAULT_MULTIPLIER;
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
