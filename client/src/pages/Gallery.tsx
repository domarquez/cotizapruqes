import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";

export default function Gallery() {
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery-images"],
  });

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

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando galería...</p>
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay imágenes en la galería todavía. El administrador puede agregar imágenes desde el panel de administración.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages
            .sort((a, b) => a.order - b.order)
            .map((image) => (
              <Card key={image.id} className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-gallery-${image.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-gallery-${image.id}`}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg" data-testid={`text-gallery-title-${image.id}`}>
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-muted-foreground mt-2" data-testid={`text-gallery-description-${image.id}`}>
                      {image.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
