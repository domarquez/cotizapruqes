import { useState } from "react";
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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editImageDialogOpen, setEditImageDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  //todo: remove mock functionality
  const [platforms, setPlatforms] = useState([
    { id: "1", height: "80cm", priceDomestic: "280000", pricePublic: "380000" },
    { id: "2", height: "90cm", priceDomestic: "310000", pricePublic: "420000" },
    { id: "3", height: "1m", priceDomestic: "340000", pricePublic: "460000" },
  ]);

  //todo: remove mock functionality
  const [modules, setModules] = useState([
    { 
      id: "1", 
      name: "Techo Madera", 
      materialDomestic: "Madera tratada",
      materialPublic: "Madera reforzada",
      priceDomestic: "120000",
      pricePublic: "180000"
    },
    { 
      id: "2", 
      name: "Resbalín Plástico", 
      materialDomestic: "Plástico HD",
      materialPublic: "Plástico industrial",
      priceDomestic: "85000",
      pricePublic: "145000"
    },
  ]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log("Admin logged out");
  };

  const updatePlatformPrice = (id: string, field: string, value: string) => {
    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    console.log(`Updated platform ${id} ${field} to ${value}`);
  };

  const updateModuleField = (id: string, field: string, value: string) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
    console.log(`Updated module ${id} ${field} to ${value}`);
  };

  const deletePlatform = (id: string) => {
    setPlatforms(platforms.filter(p => p.id !== id));
    console.log(`Deleted platform ${id}`);
  };

  const deleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    console.log(`Deleted module ${id}`);
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
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="hover-elevate active-elevate-2"
                      data-testid="button-add-platform"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Plataforma</DialogTitle>
                      <DialogDescription>
                        Ingresa los datos de la nueva plataforma
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Altura</Label>
                        <Input id="height" placeholder="Ej: 1.80m" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price-domestic">Precio Doméstico (CLP)</Label>
                        <Input id="price-domestic" type="number" placeholder="450000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price-public">Precio Público (CLP)</Label>
                        <Input id="price-public" type="number" placeholder="620000" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => {
                          console.log("Platform added");
                          setAddDialogOpen(false);
                        }}
                        className="hover-elevate active-elevate-2"
                      >
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
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
                          onSave={(value) => updatePlatformPrice(platform.id, "height", value)}
                          testId={`platform-${platform.id}-height`}
                        />
                      </TableCell>
                      <TableCell>
                        <InlineEditInput
                          value={platform.priceDomestic}
                          onSave={(value) => updatePlatformPrice(platform.id, "priceDomestic", value)}
                          type="number"
                          testId={`platform-${platform.id}-domestic`}
                        />
                      </TableCell>
                      <TableCell>
                        <InlineEditInput
                          value={platform.pricePublic}
                          onSave={(value) => updatePlatformPrice(platform.id, "pricePublic", value)}
                          type="number"
                          testId={`platform-${platform.id}-public`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover-elevate active-elevate-2"
                          onClick={() => deletePlatform(platform.id)}
                          data-testid={`button-delete-platform-${platform.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  onClick={() => console.log("Add module")}
                  data-testid="button-add-module"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Material Doméstico</TableHead>
                    <TableHead>Material Público</TableHead>
                    <TableHead>Precio Dom.</TableHead>
                    <TableHead>Precio Púb.</TableHead>
                    <TableHead>Imagen</TableHead>
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
                          value={module.materialDomestic}
                          onSave={(value) => updateModuleField(module.id, "materialDomestic", value)}
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
                      <TableCell>
                        <Dialog open={editImageDialogOpen && selectedItem?.id === module.id} 
                                onOpenChange={(open) => {
                                  setEditImageDialogOpen(open);
                                  if (!open) setSelectedItem(null);
                                }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItem(module)}
                              className="hover-elevate active-elevate-2"
                              data-testid={`button-edit-image-${module.id}`}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Cambiar Imagen</DialogTitle>
                              <DialogDescription>
                                Sube una nueva imagen para {module.name}
                              </DialogDescription>
                            </DialogHeader>
                            <ImageUpload
                              onImageChange={(file) => console.log("Image changed:", file)}
                              label="Imagen del Módulo"
                              testId={`module-${module.id}-image`}
                            />
                            <DialogFooter>
                              <Button 
                                onClick={() => {
                                  console.log("Image saved");
                                  setEditImageDialogOpen(false);
                                  setSelectedItem(null);
                                }}
                                className="hover-elevate active-elevate-2"
                              >
                                Guardar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover-elevate active-elevate-2"
                          onClick={() => deleteModule(module.id)}
                          data-testid={`button-delete-module-${module.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
