import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Admin() {
  //todo: remove mock functionality
  const [platforms, setPlatforms] = useState([
    { id: "1", height: "80cm", price: "280000" },
    { id: "2", height: "90cm", price: "310000" },
    { id: "3", height: "1m", price: "340000" },
  ]);

  //todo: remove mock functionality
  const [modules, setModules] = useState([
    { id: "1", name: "Techo Madera", material: "Madera tratada", price: "120000" },
    { id: "2", name: "Resbalín Plástico", material: "Plástico HD", price: "85000" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">
          Panel Administrativo
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestiona precios y módulos del sistema de cotización
        </p>
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
                    Administra las plataformas base y sus precios
                  </CardDescription>
                </div>
                <Button 
                  className="hover-elevate active-elevate-2"
                  onClick={() => console.log("Add platform")}
                  data-testid="button-add-platform"
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
                    <TableHead>Altura</TableHead>
                    <TableHead>Precio (CLP)</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platforms.map((platform) => (
                    <TableRow key={platform.id} data-testid={`row-platform-${platform.id}`}>
                      <TableCell className="font-medium">{platform.height}</TableCell>
                      <TableCell>${parseInt(platform.price).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => console.log(`Edit ${platform.id}`)}
                            data-testid={`button-edit-platform-${platform.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => console.log(`Delete ${platform.id}`)}
                            data-testid={`button-delete-platform-${platform.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                    Administra módulos adicionales y accesorios
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
                    <TableHead>Material</TableHead>
                    <TableHead>Precio (CLP)</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id} data-testid={`row-module-${module.id}`}>
                      <TableCell className="font-medium">{module.name}</TableCell>
                      <TableCell>{module.material}</TableCell>
                      <TableCell>${parseInt(module.price).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => console.log(`Edit ${module.id}`)}
                            data-testid={`button-edit-module-${module.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover-elevate active-elevate-2"
                            onClick={() => console.log(`Delete ${module.id}`)}
                            data-testid={`button-delete-module-${module.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
