import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import playhouseImage from "@assets/generated_images/Wooden_playhouse_product_image_a65facdf.png";
import towerImage from "@assets/generated_images/Playground_tower_structure_image_d1b63007.png";
import cabinImage from "@assets/generated_images/Large_wooden_cabin_image_1817a604.png";
import heroImage from "@assets/generated_images/Children_playground_hero_image_7fd6819a.png";

export default function Gallery() {
  //todo: remove mock functionality
  const projects = [
    { id: "1", title: "Parque Residencial Los Pinos", category: "Parque Infantil", imageUrl: heroImage },
    { id: "2", title: "Casa de Juegos Familiar", category: "Casa de Madera", imageUrl: playhouseImage },
    { id: "3", title: "Torre Aventura", category: "Parque Infantil", imageUrl: towerImage },
    { id: "4", title: "Cabaña Premium 3x3", category: "Casa de Madera", imageUrl: cabinImage },
    { id: "5", title: "Parque Escolar San José", category: "Parque Infantil", imageUrl: heroImage },
    { id: "6", title: "Casa de Juegos Deluxe", category: "Casa de Madera", imageUrl: playhouseImage },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-gallery-title">
          Galería de Proyectos
        </h1>
        <p className="text-xl text-muted-foreground">
          Descubre algunos de nuestros proyectos realizados
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-project-${project.id}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                data-testid={`img-project-${project.id}`}
              />
            </div>
            <CardContent className="p-4">
              <Badge className="mb-2" data-testid={`badge-category-${project.id}`}>
                {project.category}
              </Badge>
              <h3 className="font-semibold text-lg" data-testid={`text-project-title-${project.id}`}>
                {project.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
