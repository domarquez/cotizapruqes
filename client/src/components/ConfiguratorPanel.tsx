import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, ChevronDown, Check, Home, Building2, ClipboardList } from "lucide-react";
import ModuleCard from "./ModuleCard";
import PriceSummary from "./PriceSummary";
import { Button } from "@/components/ui/button";
import type { Platform, Module } from "@shared/schema";
import { getAdjustedModulePrice, getPlatformMultiplier } from "@shared/pricing";

export default function ConfiguratorPanel() {
  const [productType, setProductType] = useState<"playground" | "house" | null>(null);
  const [useType, setUseType] = useState<"domestic" | "public" | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("techos");
  const prevPlatformRef = useRef<string | null>(null);
  
  // Refs para scroll automático
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const { data: allPlatforms = [], isLoading: loadingPlatforms } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const { data: modules = [], isLoading: loadingModules } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  // Filter platforms by category
  const platforms = allPlatforms.filter(p => p.category === (productType || "playground"));

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Scroll automático al siguiente paso
  const scrollToElement = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -100; // Offset para dejar espacio arriba
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Auto-scroll cuando cambia el tipo de uso
  useEffect(() => {
    if (useType && step2Ref.current) {
      setTimeout(() => scrollToElement(step2Ref), 300);
    }
  }, [useType]);

  // Auto-scroll cuando cambia el tipo de producto
  useEffect(() => {
    if (productType && step3Ref.current) {
      setTimeout(() => scrollToElement(step3Ref), 300);
    }
  }, [productType]);

  // Auto-scroll cuando se selecciona plataforma
  useEffect(() => {
    if (selectedPlatform && step4Ref.current) {
      setTimeout(() => scrollToElement(step4Ref), 300);
    }
  }, [selectedPlatform]);

  // Reset modules when platform changes to avoid stale pricing
  useEffect(() => {
    if (prevPlatformRef.current !== selectedPlatform) {
      prevPlatformRef.current = selectedPlatform;
      setSelectedModules(new Set());
      setItemQuantities(prev => {
        const newQuantities = { ...prev };
        Object.keys(newQuantities).forEach(id => {
          if (id !== selectedPlatform) {
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

  // Categorías de módulos disponibles (ampliadas)
  const MODULE_CATEGORIES = {
    techos: "Techos",
    resbalines: "Resbalines", 
    columpios: "Columpios",
    trepadoras: "Trepadoras",
    barandas: "Barandas",
    sube_y_baja: "Sube y Baja",
    calistenia: "Calistenia",
    accesorios: "Accesorios",
  };

  // Filter modules by category and availability (dinámico)
  const modulesByCategory = useType ? 
    Object.keys(MODULE_CATEGORIES).reduce((acc, categoryKey) => {
      acc[categoryKey] = modules.filter(m => {
        const price = useType === "domestic" 
          ? parseFloat(m.priceDomestic) 
          : parseFloat(m.pricePublic);
        return m.category === categoryKey && price > 0;
      });
      return acc;
    }, {} as Record<string, typeof modules>) 
    : {};

  // Reset selected category when productType or useType changes
  useEffect(() => {
    const availableCategories = Object.keys(MODULE_CATEGORIES).filter(
      key => modulesByCategory[key]?.length > 0
    );
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [productType, useType, modules]);

  const toggleModule = (moduleId: string) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
      const newQuantities = { ...itemQuantities };
      delete newQuantities[moduleId];
      setItemQuantities(newQuantities);
    } else {
      newSelected.add(moduleId);
      setItemQuantities({ ...itemQuantities, [moduleId]: 1 });
    }
    setSelectedModules(newSelected);
  };

  const getSummaryItems = () => {
    const items: Array<{ id: string; name: string; price: number; quantity: number }> = [];
    
    const currentPlatform = platforms.find(p => p.id === selectedPlatform);
    
    if (productType === "playground" && selectedPlatform) {
      const platform = platforms.find(p => p.id === selectedPlatform);
      if (platform && useType) {
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
      if (housePlatform && useType) {
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

    modules.forEach(module => {
      if (selectedModules.has(module.id) && useType) {
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
    setProductType(null);
    setUseType(null);
    setSelectedPlatform(null);
    setSelectedModules(new Set());
    setItemQuantities({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingPlatforms || loadingModules) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted-foreground">Cargando configurador...</p>
      </div>
    );
  }

  const displayItems = platforms;

  // Determinar qué pasos están completos
  const step1Complete = useType !== null;
  const step2Complete = productType !== null;
  const step3Complete = selectedPlatform !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-configurator-title">
          Configurador de Productos
        </h1>
        <p className="text-muted-foreground text-lg" data-testid="text-configurator-subtitle">
          Sigue los pasos para crear tu cotización personalizada
        </p>
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-6">
          {/* PASO 1: Tipo de Uso */}
          <Card data-testid="card-step-1" className="relative">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-lg ${
                  step1Complete 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-primary text-primary"
                }`}>
                  {step1Complete ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <div className="min-w-0">
                  <CardTitle>Paso 1: Selecciona el Tipo de Uso</CardTitle>
                  <CardDescription>
                    ¿Es para uso privado o público?
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className={`cursor-pointer transition-all min-w-0 ${useType === "domestic" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setUseType("domestic")}>
                  <CardHeader className="space-y-1.5">
                    <CardTitle className="flex items-center flex-wrap gap-2 text-base">
                      <span className="shrink-0">Uso Domicilio</span>
                      {useType === "domestic" && <Badge className="shrink-0">Seleccionado</Badge>}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Para casas y jardines particulares
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={useType === "domestic" ? "default" : "outline"}
                      className="w-full"
                      data-testid="button-use-domestic"
                    >
                      {useType === "domestic" ? "Seleccionado" : "Seleccionar"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all min-w-0 ${useType === "public" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setUseType("public")}>
                  <CardHeader className="space-y-1.5">
                    <CardTitle className="flex items-center flex-wrap gap-2 text-base">
                      <span className="shrink-0">Uso Público</span>
                      {useType === "public" && <Badge className="shrink-0">Seleccionado</Badge>}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Para colegios, plazas y espacios públicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={useType === "public" ? "default" : "outline"}
                      className="w-full"
                      data-testid="button-use-public"
                    >
                      {useType === "public" ? "Seleccionado" : "Seleccionar"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {useType === "public" && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Uso Público:</strong> Materiales reforzados para uso intensivo
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            {step1Complete && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce">
                  <ChevronDown className="h-6 w-6" />
                </div>
              </div>
            )}
          </Card>

          {/* PASO 2: Tipo de Producto */}
          {step1Complete && (
            <div ref={step2Ref}>
              <Card data-testid="card-step-2" className="relative">
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-lg ${
                      step2Complete 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-primary text-primary"
                    }`}>
                      {step2Complete ? <Check className="h-5 w-5" /> : "2"}
                    </div>
                    <div className="min-w-0">
                      <CardTitle>Paso 2: Elige el Tipo de Producto</CardTitle>
                      <CardDescription>
                        ¿Qué deseas configurar?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      variant={productType === "playground" ? "default" : "outline"}
                      onClick={() => {
                        setProductType("playground");
                        setSelectedPlatform(null);
                        setSelectedModules(new Set());
                        setItemQuantities({});
                      }}
                      className="flex-1 h-20 text-lg"
                      data-testid="button-type-playground"
                    >
                      <Building2 className="h-6 w-6 mr-2" />
                      Parque Infantil
                    </Button>
                    <Button
                      variant={productType === "house" ? "default" : "outline"}
                      onClick={() => {
                        setProductType("house");
                        setSelectedPlatform(null);
                        setSelectedModules(new Set());
                        setItemQuantities({});
                      }}
                      className="flex-1 h-20 text-lg"
                      data-testid="button-type-house"
                    >
                      <Home className="h-6 w-6 mr-2" />
                      Casa de Madera
                    </Button>
                  </div>
                </CardContent>
                
                {step2Complete && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce">
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* PASO 3: Selección de Plataforma */}
          {step2Complete && (
            <div ref={step3Ref}>
              <Card data-testid="card-platform-selection" className="relative">
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-lg ${
                      step3Complete 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-primary text-primary"
                    }`}>
                      {step3Complete ? <Check className="h-5 w-5" /> : "3"}
                    </div>
                    <div className="min-w-0">
                      <CardTitle>
                        Paso 3: Selecciona {productType === "playground" ? "la Plataforma Base" : "el Tamaño de la Casa"}
                      </CardTitle>
                      <CardDescription>
                        Elige {productType === "playground" ? "la altura de la plataforma" : "el tamaño de la casa"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {displayItems.map((item: any) => {
                      const price = useType === "domestic" 
                        ? parseFloat(item.priceDomestic) 
                        : parseFloat(item.pricePublic);
                      const label = item.height;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedPlatform(item.id);
                            setItemQuantities({ ...itemQuantities, [item.id]: 1 });
                          }}
                          className={`rounded-lg border-2 transition-all hover-elevate active-elevate-2 overflow-hidden ${
                            selectedPlatform === item.id
                              ? "border-primary bg-primary/5 ring-2 ring-primary"
                              : "border-border"
                          }`}
                          data-testid={`button-${productType}-${item.id}`}
                        >
                          {item.imageUrl && (
                            <div className="w-full h-24 bg-muted overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={label}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <div className="font-semibold mb-1">{label}</div>
                            <div className="text-sm text-muted-foreground">
                              Bs {price.toLocaleString()}
                            </div>
                            {selectedPlatform === item.id && (
                              <Badge className="mt-2 w-full">✓ Seleccionado</Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
                
                {step3Complete && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce">
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* PASO 4: Módulos (Opcional) */}
          {step3Complete && (
            <div ref={step4Ref}>
              <Card data-testid="card-modules-selection">
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-bold text-lg">
                      4
                    </div>
                    <div className="min-w-0">
                      <CardTitle>Paso 4: Agrega Módulos (Opcional)</CardTitle>
                      <CardDescription>
                        Personaliza tu {productType === "playground" ? "parque" : "casa"} con módulos adicionales
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {(() => {
                    // Solo mostrar categorías que tienen módulos
                    const availableCategories = Object.entries(MODULE_CATEGORIES)
                      .filter(([key]) => modulesByCategory[key]?.length > 0);
                    
                    if (availableCategories.length === 0) {
                      return (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            No hay módulos disponibles para {productType === "playground" ? "parques infantiles" : "casitas"} con uso {useType === "domestic" ? "doméstico" : "público"}.
                            {" "}Puedes continuar con tu cotización o contactar al administrador para agregar módulos.
                          </AlertDescription>
                        </Alert>
                      );
                    }
                    
                    return (
                      <>
                        {/* Selector para móvil - Menu desplegable superpuesto */}
                        <div className="sm:hidden mb-6">
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full" data-testid="select-category-mobile">
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.map(([key, label]) => (
                                <SelectItem key={key} value={key} data-testid={`select-item-${key}`}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tabs para tablet/desktop - Scroll horizontal */}
                        <div className="hidden sm:block">
                          <ScrollArea className="w-full">
                            <div className="w-full">
                              <div className="inline-flex h-auto p-1 bg-muted rounded-md w-max">
                                {availableCategories.map(([key, label]) => (
                                  <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    data-testid={`tab-${key}`}
                                    className={`px-4 py-2 rounded-sm whitespace-nowrap transition-colors ${
                                      selectedCategory === key
                                        ? "bg-background shadow-sm"
                                        : "hover-elevate"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>

                        {/* Aviso de recordatorio */}
                        <Alert className="mt-6 mb-4 bg-primary/5 border-primary/20">
                          <Info className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-sm">
                            <strong>¡No olvides seleccionar módulos!</strong> Explora las categorías {availableCategories.length > 1 ? (window.innerWidth < 640 ? "en el menú desplegable" : "arriba") : ""} para agregar componentes a tu configuración.
                          </AlertDescription>
                        </Alert>
                        
                        {/* Contenido de módulos */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {modulesByCategory[selectedCategory]?.map((module) => {
                            const material = useType === "domestic" ? module.material : module.materialPublic;
                            const currentPlatform = platforms.find(p => p.id === selectedPlatform);
                            const price = getAdjustedModulePrice(module, currentPlatform, useType!);
                            return (
                              <ModuleCard
                                key={module.id}
                                id={module.id}
                                name={module.name}
                                material={material}
                                price={price}
                                isSelected={selectedModules.has(module.id)}
                                onToggle={() => toggleModule(module.id)}
                                useType={useType!}
                                imageUrl={module.imageUrl}
                              />
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                  
                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>¿Ya terminaste?</strong> Revisa tu resumen en el panel de la derecha y solicita tu cotización
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botón de reiniciar */}
          {step1Complete && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={resetSelection}
                data-testid="button-reset"
              >
                ↻ Empezar de Nuevo
              </Button>
            </div>
          )}
        </div>

        {/* Panel de Resumen - Sticky en desktop */}
        <div ref={summaryRef} className="lg:sticky lg:top-24 lg:self-start">
          {step3Complete && (
            <PriceSummary
              items={getSummaryItems()}
              onQuantityChange={handleQuantityChange}
              useType={useType!}
              productType={productType!}
            />
          )}
          
          {!step3Complete && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Cotización</CardTitle>
                <CardDescription>
                  Completa los pasos para ver tu resumen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center py-8 text-muted-foreground">
                  <ClipboardList className="h-16 w-16 mx-auto opacity-50" />
                  <p className="text-sm">
                    Tu resumen aparecerá aquí cuando selecciones una {productType === "playground" ? "plataforma" : "casa"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
