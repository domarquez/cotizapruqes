import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModuleCard from "./ModuleCard";
import PriceSummary from "./PriceSummary";
import { Button } from "@/components/ui/button";

//todo: remove mock functionality
const MOCK_PLATFORMS = [
  { id: "p1", height: "80cm", price: 280000 },
  { id: "p2", height: "90cm", price: 310000 },
  { id: "p3", height: "1m", price: 340000 },
  { id: "p4", height: "1.20m", price: 380000 },
  { id: "p5", height: "1.50m", price: 450000 },
];

//todo: remove mock functionality
const MOCK_MODULES = {
  techos: [
    { id: "t1", name: "Techo Madera", material: "Madera tratada", price: 120000 },
    { id: "t2", name: "Techo Plástico", material: "Plástico HD", price: 85000 },
    { id: "t3", name: "Techo Metálico", material: "Metal galvanizado", price: 150000 },
  ],
  resbalines: [
    { id: "r1", name: "Resbalín Plástico", material: "Plástico HD", price: 85000 },
    { id: "r2", name: "Resbalín Metálico", material: "Acero inoxidable", price: 140000 },
  ],
  accesorios: [
    { id: "a1", name: "Escalera Madera", material: "Madera tratada", price: 65000 },
    { id: "a2", name: "Muro de Escalada", material: "Madera + Presas", price: 180000 },
    { id: "a3", name: "Barras Horizontales", material: "Metal", price: 95000 },
  ],
};

export default function ConfiguratorPanel() {
  const [productType, setProductType] = useState<"playground" | "house">("playground");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    console.log(`Toggling module: ${moduleId}`);
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  const getSummaryItems = () => {
    const items: Array<{ id: string; name: string; price: number; quantity: number }> = [];
    
    if (selectedPlatform) {
      const platform = MOCK_PLATFORMS.find(p => p.id === selectedPlatform);
      if (platform) {
        items.push({
          id: platform.id,
          name: `Plataforma ${platform.height}`,
          price: platform.price,
          quantity: 1,
        });
      }
    }

    Object.values(MOCK_MODULES).flat().forEach(module => {
      if (selectedModules.has(module.id)) {
        items.push({
          id: module.id,
          name: module.name,
          price: module.price,
          quantity: 1,
        });
      }
    });

    return items;
  };

  const handleQuantityChange = (id: string, delta: number) => {
    console.log(`Quantity change for ${id}: ${delta}`);
  };

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

      <div className="flex gap-4 mb-8">
        <Button
          variant={productType === "playground" ? "default" : "outline"}
          onClick={() => {
            console.log("Switched to playground");
            setProductType("playground");
            setSelectedPlatform(null);
            setSelectedModules(new Set());
          }}
          className="hover-elevate active-elevate-2"
          data-testid="button-type-playground"
        >
          Parque Infantil
        </Button>
        <Button
          variant={productType === "house" ? "default" : "outline"}
          onClick={() => {
            console.log("Switched to house");
            setProductType("house");
            setSelectedPlatform(null);
            setSelectedModules(new Set());
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
              <CardTitle>Paso 1: Selecciona la Plataforma Base</CardTitle>
              <CardDescription>
                Elige la altura de la plataforma para tu {productType === "playground" ? "parque" : "casa"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {MOCK_PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      console.log(`Selected platform: ${platform.id}`);
                      setSelectedPlatform(platform.id);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                      selectedPlatform === platform.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`button-platform-${platform.id}`}
                  >
                    <div className="font-semibold text-lg mb-1">{platform.height}</div>
                    <div className="text-sm text-muted-foreground">
                      ${platform.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedPlatform && (
            <Card data-testid="card-modules-selection">
              <CardHeader>
                <CardTitle>Paso 2: Agrega Módulos y Accesorios</CardTitle>
                <CardDescription>
                  Personaliza tu {productType === "playground" ? "parque" : "casa"} con módulos adicionales
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
                      {MOCK_MODULES.techos.map((module) => (
                        <ModuleCard
                          key={module.id}
                          {...module}
                          isSelected={selectedModules.has(module.id)}
                          onToggle={() => toggleModule(module.id)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="resbalines" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {MOCK_MODULES.resbalines.map((module) => (
                        <ModuleCard
                          key={module.id}
                          {...module}
                          isSelected={selectedModules.has(module.id)}
                          onToggle={() => toggleModule(module.id)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="accesorios" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {MOCK_MODULES.accesorios.map((module) => (
                        <ModuleCard
                          key={module.id}
                          {...module}
                          isSelected={selectedModules.has(module.id)}
                          onToggle={() => toggleModule(module.id)}
                        />
                      ))}
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
            onGeneratePDF={() => console.log("Generate PDF")}
            onSave={() => console.log("Save quote")}
          />
        </div>
      </div>
    </div>
  );
}
