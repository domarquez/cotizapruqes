import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import playhouseImage from "@assets/generated_images/Wooden_playhouse_product_image_a65facdf.png";
import towerImage from "@assets/generated_images/Playground_tower_structure_image_d1b63007.png";
import cabinImage from "@assets/generated_images/Large_wooden_cabin_image_1817a604.png";

export default function Home() {
  //todo: remove mock functionality
  const products = [
    {
      id: "1",
      title: "Parque Modular Clásico",
      description: "Plataforma base con múltiples opciones de personalización. Ideal para espacios pequeños y medianos.",
      imageUrl: playhouseImage,
      category: "Parque Infantil" as const,
      startingPrice: 450000,
    },
    {
      id: "2",
      title: "Torre de Juegos",
      description: "Sistema de múltiples niveles con escalada y resbalín. Perfecto para parques grandes.",
      imageUrl: towerImage,
      category: "Parque Infantil" as const,
      startingPrice: 680000,
    },
    {
      id: "3",
      title: "Casa de Madera Premium",
      description: "Casa espaciosa de 3x3m con acabados premium. Ideal para niños y adultos.",
      imageUrl: cabinImage,
      category: "Casa de Madera" as const,
      startingPrice: 1200000,
    },
  ];

  return (
    <div>
      <Hero />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-features-title">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Más de 10 años creando espacios de juego seguros y duraderos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6" data-testid="feature-quality">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🏆</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-muted-foreground">
                Madera tratada de primera calidad con garantía extendida
              </p>
            </div>

            <div className="text-center p-6" data-testid="feature-customization">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🎨</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalización Total</h3>
              <p className="text-muted-foreground">
                Sistema modular que se adapta a tus necesidades y presupuesto
              </p>
            </div>

            <div className="text-center p-6" data-testid="feature-installation">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🔧</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instalación Profesional</h3>
              <p className="text-muted-foreground">
                Equipo especializado con instalación incluida en el precio
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center" data-testid="text-products-title">
              Nuestros Productos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Usa nuestro configurador para diseñar tu parque ideal y obtener una cotización instantánea
            </p>
            <Link href="/configurador">
              <Button size="lg" className="text-lg px-8 hover-elevate active-elevate-2" data-testid="button-cta-configure">
                Configurar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
