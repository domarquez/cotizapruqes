import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import ModuleCard from "./ModuleCard";
import PriceSummary from "./PriceSummary";
import { Button } from "@/components/ui/button";
import type { Platform, Module } from "@shared/schema";
import { getAdjustedModulePrice, getPlatformMultiplier } from "@shared/pricing";

export default function ConfiguratorPanel() {
  const [productType, setProductType] = useState<"playground" | "house">("playground");
  const [useType, setUseType] = useState<"domestic" | "public">("domestic");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const prevPlatformRef = useRef<string | null>(null);

  const { data: allPlatforms = [], isLoading: loadingPlatforms } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const { data: modules = [], isLoading: loadingModules } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  // Filter platforms by category
  const platforms = allPlatforms.filter(p => p.category === productType);

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Reset modules when platform changes to avoid stale pricing
  useEffect(() => {
    // Only reset if platform actually changed (not just on refetch)
    if (prevPlatformRef.current !== selectedPlatform) {
      prevPlatformRef.current = selectedPlatform;
      setSelectedModules(new Set());
      setItemQuantities(prev => {
        const newQuantities = { ...prev };
        // Remove all module quantities, keeping only platform quantities
        Object.keys(newQuantities).forEach(id => {
          if (id !== selectedPlatform) {
            // Check if it's a module (not a platform)
            const isPlatform = allPlatforms.some(p => p.id === id);
            if (!isPlatform) {
              delete newQuantities[id];
            }
          }
        });
        return newQuantities;
      });
    }
  }, [selectedPlatform, allPlatforms]);

  const toggleModule = (moduleId: string) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
      // Remove quantity when deselecting
      const newQuantities = { ...itemQuantities };
      delete newQuantities[moduleId];
      setItemQuantities(newQuantities);
    } else {
      newSelected.add(moduleId);
      // Set initial quantity to 1 when selecting
      setItemQuantities({ ...itemQuantities, [moduleId]: 1 });
    }
    setSelectedModules(newSelected);
  };

  const getSummaryItems = () => {
    const items: Array<{ id: string; name: string; price: number; quantity: number }> = [];
    
    const currentPlatform = platforms.find(p => p.id === selectedPlatform);
    
    if (productType === "playground" && selectedPlatform) {
      const platform = platforms.find(p => p.id === selectedPlatform);
      if (platform) {
        const price = useType === "domestic" 
          ? parseFloat(platform.priceDomestic) 
          : parseFloat(platform.pricePublic);
        const quantity = itemQuantities[platform.id] || 1;
        items.push({
          id: platform.id,
          name: `Plataforma ${platform.height} (${useType === "domestic" ? "Domicilio" : "Pública"})`,
          price,
          quantity,
        });
      }
    }

    if (productType === "house" && selectedPlatform) {
      const housePlatform = platforms.find(p => p.id === selectedPlatform);
      if (housePlatform) {
        const price = useType === "domestic" 
          ? parseFloat(housePlatform.priceDomestic) 
          : parseFloat(housePlatform.pricePublic);
        const quantity = itemQuantities[housePlatform.id] || 1;
        items.push({
          id: housePlatform.id,
          name: `Casa ${housePlatform.height} (${useType === "domestic" ? "Domicilio" : "Pública"})`,
          price,
          quantity,
        });
      }
    }

    // Add modules for both playground and house platforms
    modules.forEach(module => {
      if (selectedModules.has(module.id)) {
        // Calculate adjusted price based on platform size
        const price = getAdjustedModulePrice(module, currentPlatform, useType);
        const quantity = itemQuantities[module.id] || 1;
        items.push({
          id: module.id,
          name: module.name,
          price,
          quantity,
        });
      }
    });

    return items;
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const currentQuantity = itemQuantities[id] || 1;
    const newQuantity = Math.max(1, currentQuantity + delta);
    setItemQuantities({ ...itemQuantities, [id]: newQuantity });
  };

  const resetSelection = () => {
    setSelectedPlatform(null);
    setSelectedModules(new Set());
    setItemQuantities({});
  };

  // Filter modules by category and availability (price > 0)
  // Modules work for both playground and house platforms
  const modulesByCategory = {
    techos: modules.filter(m => {
      const price = useType === "domestic" 
        ? parseFloat(m.priceDomestic) 
        : parseFloat(m.pricePublic);
      return m.category === "techos" && price > 0;
    }),
    resbalines: modules.filter(m => {
      const price = useType === "domestic" 
        ? parseFloat(m.priceDomestic) 
        : parseFloat(m.pricePublic);
      return m.category === "resbalines" && price > 0;
    }),
    accesorios: modules.filter(m => {
      const price = useType === "domestic" 
        ? parseFloat(m.priceDomestic) 
        : parseFloat(m.pricePublic);
      return m.category === "accesorios" && price > 0;
    }),
  };

  if (loadingPlatforms || loadingModules) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted-foreground">Cargando configurador...</p>
      </div>
    );
  }

  const displayItems = platforms;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-configurator-title">
          Configurador de Productos
        </h1>
        <p className="text-muted-foreground text-lg" data-testid="text-configurator-subtitle">
          Personaliza tu parque o casa de madera seleccionando los módulos que necesitas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className={useType === "domestic" ? "ring-2 ring-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Uso Domicilio
              {useType === "domestic" && <Badge>Seleccionado</Badge>}
            </CardTitle>
            <CardDescription>
              Para uso privado en casas y jardines particulares. Materiales estándar de alta calidad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={useType === "domestic" ? "default" : "outline"}
              className="w-full hover-elevate active-elevate-2"
              onClick={() => {
                setUseType("domestic");
                resetSelection();
              }}
              data-testid="button-use-domestic"
            >
              {useType === "domestic" ? "Seleccionado" : "Seleccionar Domicilio"}
            </Button>
          </CardContent>
        </Card>

        <Card className={useType === "public" ? "ring-2 ring-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Uso Público
              {useType === "public" && <Badge>Seleccionado</Badge>}
            </CardTitle>
            <CardDescription>
              Para espacios públicos, colegios y plazas. Materiales reforzados y mayor durabilidad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={useType === "public" ? "default" : "outline"}
              className="w-full hover-elevate active-elevate-2"
              onClick={() => {
                setUseType("public");
                resetSelection();
              }}
              data-testid="button-use-public"
            >
              {useType === "public" ? "Seleccionado" : "Seleccionar Público"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {useType === "public" && (
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Uso Público:</strong> Los materiales son más reforzados y resistentes para soportar uso intensivo. 
            Los precios incluyen tratamientos especiales y mayor espesor en estructuras.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 mb-8">
        <Button
          variant={productType === "playground" ? "default" : "outline"}
          onClick={() => {
            setProductType("playground");
            resetSelection();
          }}
          className="hover-elevate active-elevate-2"
          data-testid="button-type-playground"
        >
          Parque Infantil
        </Button>
        <Button
          variant={productType === "house" ? "default" : "outline"}
          onClick={() => {
            setProductType("house");
            resetSelection();
          }}
          className="hover-elevate active-elevate-2"
          data-testid="button-type-house"
        >
          Casa de Madera
        </Button>
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-8">
          <Card data-testid="card-platform-selection">
            <CardHeader>
              <CardTitle>
                Paso 1: Selecciona {productType === "playground" ? "la Plataforma Base" : "el Tamaño de la Casa"}
              </CardTitle>
              <CardDescription>
                Elige {productType === "playground" ? "la altura de la plataforma" : "el tamaño de la casa"} para tu {productType === "playground" ? "parque" : "casa"}
                {useType === "public" && " (versión reforzada para uso público)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {displayItems.map((item: any) => {
                  const price = useType === "domestic" 
                    ? parseFloat(item.priceDomestic) 
                    : parseFloat(item.pricePublic);
                  const label = productType === "playground" ? item.height : item.size;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedPlatform(item.id);
                        setItemQuantities({ ...itemQuantities, [item.id]: 1 });
                      }}
                      className={`rounded-lg border-2 transition-all hover-elevate active-elevate-2 overflow-hidden ${
                        selectedPlatform === item.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      data-testid={`button-${productType}-${item.id}`}
                    >
                      {item.imageUrl && (
                        <div className="w-full h-32 bg-muted overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="font-semibold text-lg mb-1">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Bs {price.toLocaleString()}
                        </div>
                        {useType === "public" && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Reforzada
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedPlatform && (
            <Card data-testid="card-modules-selection">
              <CardHeader>
                <CardTitle>Paso 2: Agrega Módulos y Accesorios</CardTitle>
                <CardDescription>
                  Personaliza tu {productType === "playground" ? "parque" : "casa"} con módulos adicionales
                  {useType === "public" && " (materiales reforzados)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="techos" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="techos" data-testid="tab-roofs">Techos</TabsTrigger>
                    <TabsTrigger value="resbalines" data-testid="tab-slides">Resbalines</TabsTrigger>
                    <TabsTrigger value="accesorios" data-testid="tab-accessories">Accesorios</TabsTrigger>
                  </TabsList>
                  <TabsContent value="techos" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {modulesByCategory.techos.map((module) => {
                        const material = useType === "domestic" ? module.material : module.materialPublic;
                        const currentPlatform = platforms.find(p => p.id === selectedPlatform);
                        const price = getAdjustedModulePrice(module, currentPlatform, useType);
                        return (
                          <ModuleCard
                            key={module.id}
                            id={module.id}
                            name={module.name}
                            material={material}
                            price={price}
                            isSelected={selectedModules.has(module.id)}
                            onToggle={() => toggleModule(module.id)}
                            useType={useType}
                            imageUrl={module.imageUrl}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="resbalines" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {modulesByCategory.resbalines.map((module) => {
                        const material = useType === "domestic" ? module.material : module.materialPublic;
                        const currentPlatform = platforms.find(p => p.id === selectedPlatform);
                        const price = getAdjustedModulePrice(module, currentPlatform, useType);
                        return (
                          <ModuleCard
                            key={module.id}
                            id={module.id}
                            name={module.name}
                            material={material}
                            price={price}
                            isSelected={selectedModules.has(module.id)}
                            onToggle={() => toggleModule(module.id)}
                            useType={useType}
                            imageUrl={module.imageUrl}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="accesorios" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {modulesByCategory.accesorios.map((module) => {
                        const material = useType === "domestic" ? module.material : module.materialPublic;
                        const currentPlatform = platforms.find(p => p.id === selectedPlatform);
                        const price = getAdjustedModulePrice(module, currentPlatform, useType);
                        return (
                          <ModuleCard
                            key={module.id}
                            id={module.id}
                            name={module.name}
                            material={material}
                            price={price}
                            isSelected={selectedModules.has(module.id)}
                            onToggle={() => toggleModule(module.id)}
                            useType={useType}
                            imageUrl={module.imageUrl}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <PriceSummary
            items={getSummaryItems()}
            onQuantityChange={handleQuantityChange}
            useType={useType}
            productType={productType}
          />
        </div>
      </div>
    </div>
  );
}
