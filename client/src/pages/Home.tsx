import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SiteContent, FeaturedProduct } from "@shared/schema";

export default function Home() {
  const { data: siteContent = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/site-content"],
  });

  const { data: featuredProducts = [] } = useQuery<FeaturedProduct[]>({
    queryKey: ["/api/featured-products"],
  });

  const getContent = (key: string, defaultValue: string) => {
    const content = siteContent.find(c => c.key === key);
    return content?.value || defaultValue;
  };

  // Placeholder image for products without uploaded images
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Filter and sort enabled products by order
  const activeProducts = featuredProducts
    .filter(p => p.enabled) // Show all enabled products
    .sort((a, b) => a.order - b.order)
    .map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category as "Parque Infantil" | "Casa de Madera",
      imageUrl: p.imageUrl || placeholderImage, // Use placeholder if no image
      startingPrice: parseFloat(p.startingPrice),
    }));

  return (
    <div>
      <Hero />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-features-title">
              {getContent("features_title", "¿Por qué elegirnos?")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {getContent("features_subtitle", "Más de 10 años creando espacios de juego seguros y duraderos")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6" data-testid="feature-quality">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🏆</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {getContent("feature_1_title", "Calidad Premium")}
              </h3>
              <p className="text-muted-foreground">
                {getContent("feature_1_description", "Madera tratada de primera calidad con garantía extendida")}
              </p>
            </div>

            <div className="text-center p-6" data-testid="feature-customization">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🎨</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {getContent("feature_2_title", "Personalización Total")}
              </h3>
              <p className="text-muted-foreground">
                {getContent("feature_2_description", "Sistema modular que se adapta a tus necesidades y presupuesto")}
              </p>
            </div>

            <div className="text-center p-6" data-testid="feature-installation">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🔧</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {getContent("feature_3_title", "Instalación Profesional")}
              </h3>
              <p className="text-muted-foreground">
                {getContent("feature_3_description", "Equipo especializado con instalación incluida en el precio")}
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center" data-testid="text-products-title">
              {getContent("products_title", "Nuestros Productos")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
              {getContent("cta_title", "¿Listo para comenzar?")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {getContent("cta_description", "Usa nuestro configurador para diseñar tu parque ideal y obtener una cotización instantánea")}
            </p>
            <Link href="/configurador">
              <Button size="lg" className="text-lg px-8 hover-elevate active-elevate-2" data-testid="button-cta-configure">
                {getContent("cta_button_text", "Configurar Ahora")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
