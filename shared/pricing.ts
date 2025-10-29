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
 * Base area for HOUSE module pricing (1m x 1m = 1 mt2)
 * Module prices in database are per mt2 based on this reference area
 */
const HOUSE_BASE_AREA_M2 = 1.0; // 1m x 1m

const DEFAULT_MULTIPLIER = 1.0;

/**
 * Calculate the area in square meters for a house platform
 * @param heightCm The height dimension in centimeters (represents one side of the square house)
 * @returns The area in square meters
 */
function calculateHouseAreaM2(heightCm: number): number {
  const sizeM = heightCm / 100; // Convert cm to meters
  return sizeM * sizeM; // Area = side × side for square houses
}

/**
 * Get the pricing multiplier for a given platform
 * @param platform The selected platform (optional)
 * @returns The multiplier value based on platform category
 */
export function getPlatformMultiplier(platform?: Platform | null): number {
  if (!platform) return DEFAULT_MULTIPLIER;
  
  // For houses: calculate multiplier based on actual area in mt2
  if (platform.category === "house") {
    const areaM2 = calculateHouseAreaM2(platform.heightCm);
    return areaM2 / HOUSE_BASE_AREA_M2;
  }
  
  // For playgrounds: use fixed multipliers based on height
  const multipliers = PLAYGROUND_MULTIPLIERS;
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
  const basePrice = useType === "domestic" 
    ? parseFloat(module.priceDomestic) 
    : parseFloat(module.pricePublic);
  
  // Special pricing logic for HOUSE platforms
  if (platform?.category === "house") {
    // Barandas and Techos: multiply by m² area (current behavior)
    if (module.category === "barandas" || module.category === "techos") {
      const multiplier = getPlatformMultiplier(platform);
      return Math.round(basePrice * multiplier);
    }
    
    // Resbalines: base price + 20% (height adjustment, not area-based)
    if (module.category === "resbalines") {
      return Math.round(basePrice * 1.2);
    }
    
    // Columpios and Trepadoras: base price + 30% (not area-based)
    if (module.category === "columpios" || module.category === "trepadoras") {
      return Math.round(basePrice * 1.3);
    }
    
    // Other categories: use base price without multiplier
    return Math.round(basePrice);
  }
  
  // PLAYGROUND platforms: use height-based multipliers for all modules
  const multiplier = getPlatformMultiplier(platform);
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
