import { Router } from "wouter";
import ProductCard from "../ProductCard";
import playhouseImage from "@assets/generated_images/Wooden_playhouse_product_image_a65facdf.png";

export default function ProductCardExample() {
  return (
    <Router>
      <div className="p-8 max-w-sm">
        <ProductCard
          id="1"
          title="Parque Modular Clásico"
          description="Plataforma base con múltiples opciones de personalización"
          imageUrl={playhouseImage}
          category="Parque Infantil"
          startingPrice={450000}
        />
      </div>
    </Router>
  );
}
