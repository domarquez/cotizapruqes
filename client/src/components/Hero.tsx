import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SiteContent } from "@shared/schema";
import heroImage from "@assets/generated_images/Children_playground_hero_image_7fd6819a.png";

export default function Hero() {
  const { data: siteContent = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/site-content"],
  });

  const getContent = (key: string, defaultValue: string) => {
    const content = siteContent.find(c => c.key === key);
    return content?.value || defaultValue;
  };

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
          {getContent("hero_title", "Diseña tu Parque Ideal")}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
          {getContent("hero_subtitle", "Sistema de cotización modular para parques infantiles y casas de madera. Personaliza cada detalle y obtén tu presupuesto en tiempo real.")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/configurador">
            <Button size="lg" className="text-lg px-8 hover-elevate active-elevate-2" data-testid="button-start-quote">
              {getContent("hero_cta_text", "Comenzar Cotización")}
            </Button>
          </Link>
          <Link href="/galeria">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-white/10 backdrop-blur-sm text-white border-white/30 hover-elevate active-elevate-2"
              data-testid="button-view-gallery"
            >
              Ver Galería
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center" data-testid="stat-projects">
            <div className="text-4xl font-bold text-white mb-2">635+</div>
            <div className="text-white/80">Proyectos Realizados</div>
          </div>
          <div className="text-center" data-testid="stat-satisfaction">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-white/80">Satisfacción</div>
          </div>
          <div className="text-center" data-testid="stat-years">
            <div className="text-4xl font-bold text-white mb-2">10+</div>
            <div className="text-white/80">Años de Experiencia</div>
          </div>
        </div>
      </div>
    </section>
  );
}
