import { useState } from "react";
import type { FC } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, LogOut, Image as ImageIcon, Check, X } from "lucide-react";
import InlineEditInput from "@/components/InlineEditInput";
import { ObjectUploader } from "@/components/ObjectUploader";
import AdminLogin from "@/components/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Platform, Module, SiteContent, GalleryImage, HeroCarouselImage } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

function EditableContentField({
  content,
  onSave,
  isPending
}: {
  content: SiteContent;
  onSave: (value: string) => void;
  isPending: boolean;
}) {
  const [editValue, setEditValue] = useState(content.value);
  const hasChanges = editValue !== content.value;

  const handleSave = () => {
    if (hasChanges) {
      onSave(editValue);
    }
  };

  const handleCancel = () => {
    setEditValue(content.value);
  };

  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium capitalize">
        {content.key.replace("hero_", "").replace("feature_", "").replace("features_", "").replace("products_", "").replace("cta_", "").replace("contact_", "").replace(/_/g, " ")}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="max-w-2xl"
          data-testid={`input-content-${content.key}`}
          disabled={isPending}
        />
        {hasChanges && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              disabled={isPending}
              className="h-9 w-9 hover-elevate active-elevate-2"
              data-testid={`button-save-${content.key}`}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              disabled={isPending}
              className="h-9 w-9 hover-elevate active-elevate-2"
              data-testid={`button-cancel-${content.key}`}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

const GalleryImageCard: FC<{
  image: GalleryImage;
  onUpdate: (id: string, data: Partial<GalleryImage>) => void;
  onDelete: (id: string) => void;
}> = ({ image, onUpdate, onDelete }) => {
  const [editTitle, setEditTitle] = useState(image.title);
  const [editPrice, setEditPrice] = useState<number | null>(image.price || null);
  const titleChanged = editTitle !== image.title;
  const priceChanged = editPrice !== image.price;

  return (
    <Card className="overflow-hidden" data-testid={`card-gallery-${image.id}`}>
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Título</Label>
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título de la imagen"
              className="text-sm"
              data-testid={`input-gallery-title-${image.id}`}
            />
            {titleChanged && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    onUpdate(image.id, { title: editTitle });
                  }}
                  className="h-9 w-9 hover-elevate active-elevate-2"
                  data-testid={`button-save-title-${image.id}`}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditTitle(image.title)}
                  className="h-9 w-9 hover-elevate active-elevate-2"
                  data-testid={`button-cancel-title-${image.id}`}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Precio (Bs)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editPrice === null ? "" : editPrice}
              onChange={(e) => {
                const value = e.target.value === "" ? null : parseInt(e.target.value);
                setEditPrice(value);
              }}
              placeholder="Precio en Bolivianos"
              className="text-sm"
              data-testid={`input-gallery-price-${image.id}`}
            />
            {priceChanged && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    onUpdate(image.id, { price: editPrice });
                  }}
                  className="h-9 w-9 hover-elevate active-elevate-2"
                  data-testid={`button-save-price-${image.id}`}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditPrice(image.price || null)}
                  className="h-9 w-9 hover-elevate active-elevate-2"
                  data-testid={`button-cancel-price-${image.id}`}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Orden: {image.order}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover-elevate active-elevate-2"
            onClick={() => onDelete(image.id)}
            data-testid={`button-delete-gallery-${image.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [addPlatformDialogOpen, setAddPlatformDialogOpen] = useState(false);
  const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);
  const [editImageDialogOpen, setEditImageDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: platforms = [], isLoading: loadingPlatforms } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
    enabled: isAuthenticated,
  });

  const { data: modules = [], isLoading: loadingModules } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
    enabled: isAuthenticated,
  });

  const { data: siteContent = [], isLoading: loadingSiteContent } = useQuery<SiteContent[]>({
    queryKey: ["/api/site-content"],
    enabled: isAuthenticated,
  });

  const { data: galleryImages = [], isLoading: loadingGallery } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery-images"],
    enabled: isAuthenticated,
  });

  const { data: heroCarouselImages = [], isLoading: loadingCarousel } = useQuery<HeroCarouselImage[]>({
    queryKey: ["/api/hero-carousel-images"],
    enabled: isAuthenticated,
  });

  const updatePlatformMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/platforms/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
      toast({ title: "Plataforma actualizada" });
    },
    onError: () => {
      toast({ title: "Error al actualizar", variant: "destructive" });
    },
  });

  const deletePlatformMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/platforms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
      toast({ title: "Plataforma eliminada" });
    },
    onError: () => {
      toast({ title: "Error al eliminar", variant: "destructive" });
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/modules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Módulo actualizado" });
    },
    onError: () => {
      toast({ title: "Error al actualizar", variant: "destructive" });
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/modules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Módulo eliminado" });
    },
    onError: () => {
      toast({ title: "Error al eliminar", variant: "destructive" });
    },
  });

  const addPlatformMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/platforms", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
      toast({ title: "Plataforma agregada exitosamente" });
      setAddPlatformDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error al agregar plataforma", variant: "destructive" });
    },
  });

  const addModuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/modules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Módulo agregado exitosamente" });
      setAddModuleDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error al agregar módulo", variant: "destructive" });
    },
  });

  const updatePlatformImageMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      return await apiRequest("PUT", `/api/platforms/${id}/image`, { imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
      toast({ title: "Imagen actualizada" });
    },
    onError: () => {
      toast({ title: "Error al actualizar imagen", variant: "destructive" });
    },
  });

  const updateModuleImageMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      return await apiRequest("PUT", `/api/modules/${id}/image`, { imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Imagen actualizada" });
    },
    onError: () => {
      toast({ title: "Error al actualizar imagen", variant: "destructive" });
    },
  });

  const updateSiteContentMutation = useMutation({
    mutationFn: async (data: { key: string; value: string; type: string; section: string }) => {
      return await apiRequest("POST", "/api/site-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      toast({ title: "Contenido actualizado" });
    },
    onError: () => {
      toast({ title: "Error al actualizar contenido", variant: "destructive" });
    },
  });

  const addGalleryImageMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; title: string; description?: string; order: number }) => {
      return await apiRequest("POST", "/api/gallery-images", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-images"] });
      toast({ title: "Imagen agregada a galería" });
    },
    onError: () => {
      toast({ title: "Error al agregar imagen", variant: "destructive" });
    },
  });

  const updateGalleryImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GalleryImage> }) => {
      return await apiRequest("PATCH", `/api/gallery-images/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-images"] });
      toast({ title: "Imagen de galería actualizada" });
    },
    onError: () => {
      toast({ title: "Error al actualizar imagen", variant: "destructive" });
    },
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/gallery-images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-images"] });
      toast({ title: "Imagen eliminada" });
    },
    onError: () => {
      toast({ title: "Error al eliminar imagen", variant: "destructive" });
    },
  });

  const addCarouselImageMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; order: number; enabled: boolean }) => {
      return await apiRequest("POST", "/api/hero-carousel-images", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-carousel-images"] });
      toast({ title: "Imagen agregada al carrusel" });
    },
    onError: () => {
      toast({ title: "Error al agregar imagen", variant: "destructive" });
    },
  });

  const updateCarouselImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HeroCarouselImage> }) => {
      return await apiRequest("PATCH", `/api/hero-carousel-images/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-carousel-images"] });
      toast({ title: "Imagen del carrusel actualizada" });
    },
    onError: () => {
      toast({ title: "Error al actualizar imagen", variant: "destructive" });
    },
  });

  const deleteCarouselImageMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/hero-carousel-images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-carousel-images"] });
      toast({ title: "Imagen del carrusel eliminada" });
    },
    onError: () => {
      toast({ title: "Error al eliminar imagen", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const updatePlatformField = (id: string, field: string, value: string) => {
    updatePlatformMutation.mutate({ id, data: { [field]: value } });
  };

  const updateModuleField = (id: string, field: string, value: string) => {
    updateModuleMutation.mutate({ id, data: { [field]: value } });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">
            Panel Administrativo
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestiona precios, módulos e imágenes del sistema de cotización
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="hover-elevate active-elevate-2"
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="platforms" data-testid="tab-platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="modules" data-testid="tab-modules">Módulos</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Contenido del Sitio</TabsTrigger>
          <TabsTrigger value="hero-carousel" data-testid="tab-hero-carousel">Carrusel Hero</TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery">Galería</TabsTrigger>
          <TabsTrigger value="quotes" data-testid="tab-quotes">Cotizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Plataformas</CardTitle>
                  <CardDescription>
                    Haz clic en los valores para editarlos en línea
                  </CardDescription>
                </div>
                <Button 
                  className="hover-elevate active-elevate-2"
                  data-testid="button-add-platform"
                  onClick={() => setAddPlatformDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPlatforms ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Altura</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio Doméstico (Bs)</TableHead>
                      <TableHead>Precio Público (Bs)</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platforms.map((platform) => (
                      <TableRow key={platform.id} data-testid={`row-platform-${platform.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {platform.imageUrl ? (
                              <img 
                                src={platform.imageUrl} 
                                alt={platform.height}
                                className="w-12 h-12 object-cover rounded"
                                data-testid={`img-platform-${platform.id}`}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <ObjectUploader
                              maxNumberOfFiles={1}
                              maxFileSize={5242880}
                              onGetUploadParameters={async () => {
                                const response = await fetch("/api/objects/upload", {
                                  method: "POST",
                                });
                                const data = await response.json();
                                return {
                                  method: "PUT" as const,
                                  url: data.uploadURL,
                                };
                              }}
                              onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                if (result.successful && result.successful.length > 0) {
                                  const uploadedUrl = result.successful[0].uploadURL;
                                  updatePlatformImageMutation.mutate({
                                    id: platform.id,
                                    imageUrl: uploadedUrl,
                                  });
                                }
                              }}
                              buttonClassName="h-8"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </ObjectUploader>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <InlineEditInput
                            value={platform.height}
                            onSave={(value) => updatePlatformField(platform.id, "height", value)}
                            testId={`platform-${platform.id}-height`}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground capitalize">
                            {platform.category === "playground" ? "Parque" : "Casita"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={platform.priceDomestic}
                            onSave={(value) => updatePlatformField(platform.id, "priceDomestic", value)}
                            type="number"
                            testId={`platform-${platform.id}-domestic`}
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={platform.pricePublic}
                            onSave={(value) => updatePlatformField(platform.id, "pricePublic", value)}
                            type="number"
                            testId={`platform-${platform.id}-public`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => deletePlatformMutation.mutate(platform.id)}
                            data-testid={`button-delete-platform-${platform.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Módulos</CardTitle>
                  <CardDescription>
                    Administra módulos adicionales, materiales y precios
                  </CardDescription>
                </div>
                <Button 
                  className="hover-elevate active-elevate-2"
                  onClick={() => setAddModuleDialogOpen(true)}
                  data-testid="button-add-module"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingModules ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Material Doméstico</TableHead>
                      <TableHead>Material Público</TableHead>
                      <TableHead>Precio Dom.</TableHead>
                      <TableHead>Precio Púb.</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id} data-testid={`row-module-${module.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {module.imageUrl ? (
                              <img 
                                src={module.imageUrl} 
                                alt={module.name}
                                className="w-12 h-12 object-cover rounded"
                                data-testid={`img-module-${module.id}`}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <ObjectUploader
                              maxNumberOfFiles={1}
                              maxFileSize={5242880}
                              onGetUploadParameters={async () => {
                                const response = await fetch("/api/objects/upload", {
                                  method: "POST",
                                });
                                const data = await response.json();
                                return {
                                  method: "PUT" as const,
                                  url: data.uploadURL,
                                };
                              }}
                              onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                if (result.successful && result.successful.length > 0) {
                                  const uploadedUrl = result.successful[0].uploadURL;
                                  updateModuleImageMutation.mutate({
                                    id: module.id,
                                    imageUrl: uploadedUrl,
                                  });
                                }
                              }}
                              buttonClassName="h-8"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </ObjectUploader>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <InlineEditInput
                            value={module.name}
                            onSave={(value) => updateModuleField(module.id, "name", value)}
                            testId={`module-${module.id}-name`}
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={module.material}
                            onSave={(value) => updateModuleField(module.id, "material", value)}
                            testId={`module-${module.id}-mat-dom`}
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={module.materialPublic}
                            onSave={(value) => updateModuleField(module.id, "materialPublic", value)}
                            testId={`module-${module.id}-mat-pub`}
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={module.priceDomestic}
                            onSave={(value) => updateModuleField(module.id, "priceDomestic", value)}
                            type="number"
                            testId={`module-${module.id}-price-dom`}
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditInput
                            value={module.pricePublic}
                            onSave={(value) => updateModuleField(module.id, "pricePublic", value)}
                            type="number"
                            testId={`module-${module.id}-price-pub`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => deleteModuleMutation.mutate(module.id)}
                            data-testid={`button-delete-module-${module.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenido del Sitio</CardTitle>
              <CardDescription>
                Edita todos los textos e imágenes de tu página web
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSiteContent ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : (
                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Sección Principal (Hero)</h3>
                    
                    {/* Hero Image Upload */}
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Imagen de Fondo del Hero</Label>
                      <div className="flex items-center gap-4">
                        {siteContent.find(c => c.key === "hero_image_url")?.value && (
                          <div className="w-32 h-20 rounded-md overflow-hidden border">
                            <img
                              src={siteContent.find(c => c.key === "hero_image_url")?.value}
                              alt="Hero background"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={5242880}
                          onGetUploadParameters={async () => {
                            const response = await fetch("/api/objects/upload-public", {
                              method: "POST",
                            });
                            const data = await response.json();
                            return {
                              method: "PUT" as const,
                              url: data.uploadURL,
                            };
                          }}
                          onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                            if (result.successful && result.successful.length > 0) {
                              const uploadedUrl = result.successful[0].uploadURL;
                              // Extract filename from Google Storage URL
                              const url = new URL(uploadedUrl);
                              const pathParts = url.pathname.split('/');
                              const filename = pathParts[pathParts.length - 1];
                              // Convert to local URL
                              const localUrl = `/public/${filename}`;
                              updateSiteContentMutation.mutate({
                                key: "hero_image_url",
                                value: localUrl,
                                type: "text",
                                section: "hero"
                              });
                            }
                          }}
                          buttonClassName="hover-elevate active-elevate-2"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {siteContent.find(c => c.key === "hero_image_url")?.value ? "Cambiar Imagen" : "Subir Imagen"}
                        </ObjectUploader>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Imagen de fondo para la sección principal (recomendado: 1920x600px)
                      </p>
                    </div>

                    {siteContent
                      .filter(c => c.section === "hero" && c.key !== "hero_image_url")
                      .map(content => (
                        <EditableContentField
                          key={content.id}
                          content={content}
                          onSave={(value) => {
                            updateSiteContentMutation.mutate({
                              key: content.key,
                              value,
                              type: content.type,
                              section: content.section
                            });
                          }}
                          isPending={updateSiteContentMutation.isPending}
                        />
                      ))}
                  </div>

                  {/* Features Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Sección ¿Por qué elegirnos?</h3>
                    {siteContent
                      .filter(c => c.section === "features")
                      .map(content => (
                        <EditableContentField
                          key={content.id}
                          content={content}
                          onSave={(value) => {
                            updateSiteContentMutation.mutate({
                              key: content.key,
                              value,
                              type: content.type,
                              section: content.section
                            });
                          }}
                          isPending={updateSiteContentMutation.isPending}
                        />
                      ))}
                  </div>

                  {/* Products Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Sección Productos</h3>
                    {siteContent
                      .filter(c => c.section === "products")
                      .map(content => (
                        <EditableContentField
                          key={content.id}
                          content={content}
                          onSave={(value) => {
                            updateSiteContentMutation.mutate({
                              key: content.key,
                              value,
                              type: content.type,
                              section: content.section
                            });
                          }}
                          isPending={updateSiteContentMutation.isPending}
                        />
                      ))}
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Llamada a la Acción (CTA)</h3>
                    {siteContent
                      .filter(c => c.section === "cta")
                      .map(content => (
                        <EditableContentField
                          key={content.id}
                          content={content}
                          onSave={(value) => {
                            updateSiteContentMutation.mutate({
                              key: content.key,
                              value,
                              type: content.type,
                              section: content.section
                            });
                          }}
                          isPending={updateSiteContentMutation.isPending}
                        />
                      ))}
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Información de Contacto</h3>
                    {siteContent
                      .filter(c => c.section === "contact")
                      .map(content => (
                        <EditableContentField
                          key={content.id}
                          content={content}
                          onSave={(value) => {
                            updateSiteContentMutation.mutate({
                              key: content.key,
                              value,
                              type: content.type,
                              section: content.section
                            });
                          }}
                          isPending={updateSiteContentMutation.isPending}
                        />
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero-carousel" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Carrusel de Hero</CardTitle>
                  <CardDescription>
                    Gestiona las imágenes del carrusel de la sección Hero. Las imágenes habilitadas se mostrarán en rotación automática.
                  </CardDescription>
                </div>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5242880}
                  onGetUploadParameters={async () => {
                    const response = await fetch("/api/objects/upload-public", {
                      method: "POST",
                    });
                    const data = await response.json();
                    return {
                      method: "PUT" as const,
                      url: data.uploadURL,
                    };
                  }}
                  onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                    if (result.successful && result.successful.length > 0) {
                      const uploadedUrl = result.successful[0].uploadURL;
                      const url = new URL(uploadedUrl);
                      const pathParts = url.pathname.split('/');
                      const filename = pathParts[pathParts.length - 1];
                      const localUrl = `/public/${filename}`;
                      const nextOrder = heroCarouselImages.length > 0 
                        ? Math.max(...heroCarouselImages.map(img => img.order)) + 1 
                        : 0;
                      addCarouselImageMutation.mutate({
                        imageUrl: localUrl,
                        order: nextOrder,
                        enabled: true
                      });
                    }
                  }}
                  buttonClassName="hover-elevate active-elevate-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Imagen
                </ObjectUploader>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCarousel ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : heroCarouselImages.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No hay imágenes en el carrusel. Agrega la primera imagen usando el botón de arriba.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heroCarouselImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden" data-testid={`card-carousel-${image.id}`}>
                      <div className="aspect-video bg-muted overflow-hidden relative">
                        <img
                          src={image.imageUrl}
                          alt={`Carrusel ${image.order}`}
                          className="w-full h-full object-cover"
                          data-testid={`img-carousel-${image.id}`}
                        />
                        {!image.enabled && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Deshabilitada</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Orden: {image.order}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={image.enabled ? "default" : "outline"}
                              onClick={() => updateCarouselImageMutation.mutate({
                                id: image.id,
                                data: { enabled: !image.enabled }
                              })}
                              className="h-7 text-xs hover-elevate active-elevate-2"
                              data-testid={`button-toggle-carousel-${image.id}`}
                            >
                              {image.enabled ? "Habilitada" : "Deshabilitada"}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover-elevate active-elevate-2"
                              onClick={() => deleteCarouselImageMutation.mutate(image.id)}
                              data-testid={`button-delete-carousel-${image.id}`}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Galería de Imágenes</CardTitle>
                  <CardDescription>
                    Gestiona las imágenes que aparecen en la galería de tu sitio
                  </CardDescription>
                </div>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5242880}
                  onGetUploadParameters={async () => {
                    const response = await fetch("/api/objects/upload-public", {
                      method: "POST",
                    });
                    const data = await response.json();
                    return {
                      method: "PUT" as const,
                      url: data.uploadURL,
                    };
                  }}
                  onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                    if (result.successful && result.successful.length > 0) {
                      const uploadedUrl = result.successful[0].uploadURL;
                      // Extract filename from Google Storage URL
                      const url = new URL(uploadedUrl);
                      const pathParts = url.pathname.split('/');
                      const filename = pathParts[pathParts.length - 1];
                      // Convert to local URL
                      const localUrl = `/public/${filename}`;
                      const nextOrder = galleryImages.length > 0 
                        ? Math.max(...galleryImages.map(img => img.order)) + 1 
                        : 0;
                      addGalleryImageMutation.mutate({
                        imageUrl: localUrl,
                        title: "Nueva imagen",
                        order: nextOrder
                      });
                    }
                  }}
                  buttonClassName="hover-elevate active-elevate-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Imagen
                </ObjectUploader>
              </div>
            </CardHeader>
            <CardContent>
              {loadingGallery ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : galleryImages.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No hay imágenes en la galería. Agrega la primera imagen usando el botón de arriba.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <GalleryImageCard
                      key={image.id}
                      image={image}
                      onUpdate={(id, data) => updateGalleryImageMutation.mutate({ id, data })}
                      onDelete={(id) => deleteGalleryImageMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Guardadas</CardTitle>
              <CardDescription>
                Historial de cotizaciones generadas por clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Las cotizaciones aparecerán aquí una vez que los clientes las guarden
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addModuleDialogOpen} onOpenChange={setAddModuleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Módulo</DialogTitle>
            <DialogDescription>
              Completa los datos del nuevo módulo. Recuerda que los precios son para plataforma base 1m x 1m.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get("name") as string,
                category: formData.get("category") as string,
                material: formData.get("material") as string,
                materialPublic: formData.get("materialPublic") as string,
                priceDomestic: formData.get("priceDomestic") as string,
                pricePublic: formData.get("pricePublic") as string,
                productType: formData.get("productType") as string,
                description: formData.get("description") as string || null,
              };
              addModuleMutation.mutate(data);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Módulo *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Ej: Techo PVC teja"
                  data-testid="input-module-name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Categoría *</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="select-module-category"
                >
                  <option value="">Seleccionar...</option>
                  <option value="techos">Techos</option>
                  <option value="resbalines">Resbalines</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="productType">Tipo de Producto *</Label>
                <select
                  id="productType"
                  name="productType"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="select-module-product-type"
                >
                  <option value="">Seleccionar...</option>
                  <option value="playground">Parque Infantil</option>
                  <option value="house">Casa de Madera</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Precio base: Parques (1m x 1m) | Casitas (2m x 2m)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="material">Material Doméstico *</Label>
                  <Input
                    id="material"
                    name="material"
                    required
                    placeholder="Ej: Madera pino"
                    data-testid="input-module-material"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="materialPublic">Material Público *</Label>
                  <Input
                    id="materialPublic"
                    name="materialPublic"
                    required
                    placeholder="Ej: Madera reforzada"
                    data-testid="input-module-material-public"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priceDomestic">Precio Doméstico (Bs) *</Label>
                  <Input
                    id="priceDomestic"
                    name="priceDomestic"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="input-module-price-domestic"
                  />
                  <p className="text-xs text-muted-foreground">Parques: 1m x 1m | Casitas: 2m x 2m</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pricePublic">Precio Público (Bs) *</Label>
                  <Input
                    id="pricePublic"
                    name="pricePublic"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="input-module-price-public"
                  />
                  <p className="text-xs text-muted-foreground">Parques: 1m x 1m | Casitas: 2m x 2m</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Descripción adicional del módulo"
                  data-testid="input-module-description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModuleDialogOpen(false)}
                data-testid="button-cancel-module"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={addModuleMutation.isPending}
                data-testid="button-submit-module"
              >
                {addModuleMutation.isPending ? "Agregando..." : "Agregar Módulo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addPlatformDialogOpen} onOpenChange={setAddPlatformDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Plataforma</DialogTitle>
            <DialogDescription>
              Completa los datos de la nueva plataforma. Puede ser para parque infantil o casita.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                height: formData.get("height") as string,
                heightCm: parseInt(formData.get("heightCm") as string),
                category: formData.get("category") as string,
                priceDomestic: formData.get("priceDomestic") as string,
                pricePublic: formData.get("pricePublic") as string,
              };
              addPlatformMutation.mutate(data);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Altura (texto) *</Label>
                  <Input
                    id="height"
                    name="height"
                    required
                    placeholder="Ej: 80cm, 1m, 1.2m"
                    data-testid="input-platform-height"
                  />
                  <p className="text-xs text-muted-foreground">Como se mostrará al cliente</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="heightCm">Altura en cm *</Label>
                  <Input
                    id="heightCm"
                    name="heightCm"
                    type="number"
                    required
                    placeholder="80, 100, 120..."
                    data-testid="input-platform-height-cm"
                  />
                  <p className="text-xs text-muted-foreground">Para cálculo de multiplicador</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Categoría *</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="select-platform-category"
                >
                  <option value="">Seleccionar...</option>
                  <option value="playground">Parque Infantil</option>
                  <option value="house">Casita de Madera</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priceDomestic">Precio Doméstico (Bs) *</Label>
                  <Input
                    id="priceDomestic"
                    name="priceDomestic"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="input-platform-price-domestic"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pricePublic">Precio Público (Bs) *</Label>
                  <Input
                    id="pricePublic"
                    name="pricePublic"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="input-platform-price-public"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddPlatformDialogOpen(false)}
                data-testid="button-cancel-platform"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={addPlatformMutation.isPending}
                data-testid="button-submit-platform"
              >
                {addPlatformMutation.isPending ? "Agregando..." : "Agregar Plataforma"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
