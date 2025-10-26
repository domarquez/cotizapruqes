import { db } from "./db";
import { platforms, modules, houses } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(modules);
  await db.delete(platforms);
  await db.delete(houses);

  // Seed platforms
  const platformData = [
    { height: "80cm", heightCm: 80, priceDomestic: "280000", pricePublic: "380000", category: "playground" },
    { height: "90cm", heightCm: 90, priceDomestic: "310000", pricePublic: "420000", category: "playground" },
    { height: "1m", heightCm: 100, priceDomestic: "340000", pricePublic: "460000", category: "playground" },
    { height: "1.20m", heightCm: 120, priceDomestic: "380000", pricePublic: "520000", category: "playground" },
    { height: "1.50m", heightCm: 150, priceDomestic: "450000", pricePublic: "620000", category: "playground" },
  ];

  await db.insert(platforms).values(platformData);
  console.log(`✓ Seeded ${platformData.length} platforms`);

  // Seed modules
  const moduleData = [
    {
      name: "Techo Madera",
      category: "techos",
      material: "Madera tratada",
      materialPublic: "Madera reforzada",
      priceDomestic: "120000",
      pricePublic: "180000",
      productType: "playground",
      description: "Techo de madera tratada resistente a la intemperie"
    },
    {
      name: "Techo Plástico",
      category: "techos",
      material: "Plástico HD",
      materialPublic: "Plástico HD reforzado",
      priceDomestic: "85000",
      pricePublic: "135000",
      productType: "playground",
      description: "Techo de plástico de alta densidad"
    },
    {
      name: "Techo Metálico",
      category: "techos",
      material: "Metal galvanizado",
      materialPublic: "Metal reforzado antigolpes",
      priceDomestic: "150000",
      pricePublic: "220000",
      productType: "playground",
      description: "Techo metálico galvanizado"
    },
    {
      name: "Resbalín Plástico",
      category: "resbalines",
      material: "Plástico HD",
      materialPublic: "Plástico industrial reforzado",
      priceDomestic: "85000",
      pricePublic: "145000",
      productType: "playground",
      description: "Resbalín de plástico de alta densidad"
    },
    {
      name: "Resbalín Metálico",
      category: "resbalines",
      material: "Acero inoxidable",
      materialPublic: "Acero reforzado antigolpes",
      priceDomestic: "140000",
      pricePublic: "220000",
      productType: "playground",
      description: "Resbalín de acero inoxidable"
    },
    {
      name: "Escalera Madera",
      category: "accesorios",
      material: "Madera tratada",
      materialPublic: "Madera reforzada",
      priceDomestic: "65000",
      pricePublic: "95000",
      productType: "playground",
      description: "Escalera de madera tratada"
    },
    {
      name: "Muro de Escalada",
      category: "accesorios",
      material: "Madera + Presas",
      materialPublic: "Madera reforzada + Presas industriales",
      priceDomestic: "180000",
      pricePublic: "280000",
      productType: "playground",
      description: "Muro de escalada con presas de colores"
    },
    {
      name: "Barras Horizontales",
      category: "accesorios",
      material: "Metal",
      materialPublic: "Metal reforzado",
      priceDomestic: "95000",
      pricePublic: "145000",
      productType: "playground",
      description: "Barras horizontales metálicas"
    },
  ];

  await db.insert(modules).values(moduleData);
  console.log(`✓ Seeded ${moduleData.length} modules`);

  // Seed houses
  const houseData = [
    { size: "1.50x1.50m", width: "1.50", length: "1.50", priceDomestic: "850000", pricePublic: "1200000" },
    { size: "2x2m", width: "2.00", length: "2.00", priceDomestic: "1150000", pricePublic: "1600000" },
    { size: "2.50x2.50m", width: "2.50", length: "2.50", priceDomestic: "1450000", pricePublic: "2000000" },
    { size: "3x3m", width: "3.00", length: "3.00", priceDomestic: "1800000", pricePublic: "2500000" },
  ];

  await db.insert(houses).values(houseData);
  console.log(`✓ Seeded ${houseData.length} houses`);

  console.log("✓ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
