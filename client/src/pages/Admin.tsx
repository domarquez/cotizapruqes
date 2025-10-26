import { useState } from "react";
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
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";
import InlineEditInput from "@/components/InlineEditInput";
import ImageUpload from "@/components/ImageUpload";
import AdminLogin from "@/components/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Platform, Module } from "@shared/schema";

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms" data-testid="tab-platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="modules" data-testid="tab-modules">Módulos</TabsTrigger>
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
                      <TableHead>Altura</TableHead>
                      <TableHead>Precio Doméstico (CLP)</TableHead>
                      <TableHead>Precio Público (CLP)</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platforms.map((platform) => (
                      <TableRow key={platform.id} data-testid={`row-platform-${platform.id}`}>
                        <TableCell className="font-medium">
                          <InlineEditInput
                            value={platform.height}
                            onSave={(value) => updatePlatformField(platform.id, "height", value)}
                            testId={`platform-${platform.id}-height`}
                          />
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
    </div>
  );
}
