import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import ModuleCard from "./ModuleCard";
import PriceSummary from "./PriceSummary";
import { Button } from "@/components/ui/button";

//todo: remove mock functionality
const MOCK_PLATFORMS = [
  { id: "p1", height: "80cm", priceDomestic: 280000, pricePublic: 380000 },
  { id: "p2", height: "90cm", priceDomestic: 310000, pricePublic: 420000 },
  { id: "p3", height: "1m", priceDomestic: 340000, pricePublic: 460000 },
  { id: "p4", height: "1.20m", priceDomestic: 380000, pricePublic: 520000 },
  { id: "p5", height: "1.50m", priceDomestic: 450000, pricePublic: 620000 },
];

//todo: remove mock functionality
const MOCK_MODULES = {
  techos: [
    { 
      id: "t1", 
      name: "Techo Madera", 
      materialDomestic: "Madera tratada", 
      materialPublic: "Madera reforzada",
      priceDomestic: 120000,
      pricePublic: 180000
    },
    { 
      id: "t2", 
      name: "Techo Plástico", 
      materialDomestic: "Plástico HD", 
      materialPublic: "Plástico HD reforzado",
      priceDomestic: 85000,
      pricePublic: 135000
    },
    { 
      id: "t3", 
      name: "Techo Metálico", 
      materialDomestic: "Metal galvanizado", 
      materialPublic: "Metal reforzado antigolpes",
      priceDomestic: 150000,
      pricePublic: 220000
    },
  ],
  resbalines: [
    { 
      id: "r1", 
      name: "Resbalín Plástico", 
      materialDomestic: "Plástico HD", 
      materialPublic: "Plástico industrial reforzado",
      priceDomestic: 85000,
      pricePublic: 145000
    },
    { 
      id: "r2", 
      name: "Resbalín Metálico", 
      materialDomestic: "Acero inoxidable", 
      materialPublic: "Acero reforzado antigolpes",
      priceDomestic: 140000,
      pricePublic: 220000
    },
  ],
  accesorios: [
    { 
      id: "a1", 
      name: "Escalera Madera", 
      materialDomestic: "Madera tratada", 
      materialPublic: "Madera reforzada",
      priceDomestic: 65000,
      pricePublic: 95000
    },
    { 
      id: "a2", 
      name: "Muro de Escalada", 
      materialDomestic: "Madera + Presas", 
      materialPublic: "Madera reforzada + Presas industriales",
      priceDomestic: 180000,
      pricePublic: 280000
    },
    { 
      id: "a3", 
      name: "Barras Horizontales", 
      materialDomestic: "Metal", 
      materialPublic: "Metal reforzado",
      priceDomestic: 95000,
      pricePublic: 145000
    },
  ],
};

export default function ConfiguratorPanel() {
  const [productType, setProductType] = useState<"playground" | "house">("playground");
  const [useType, setUseType] = useState<"domestic" | "public">("domestic");
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
        const price = useType === "domestic" ? platform.priceDomestic : platform.pricePublic;
        items.push({
          id: platform.id,
          name: `Plataforma ${platform.height} (${useType === "domestic" ? "Domicilio" : "Pública"})`,
          price,
          quantity: 1,
        });
      }
    }

    Object.values(MOCK_MODULES).flat().forEach(module => {
      if (selectedModules.has(module.id)) {
        const price = useType === "domestic" ? module.priceDomestic : module.pricePublic;
        items.push({
          id: module.id,
          name: module.name,
          price,
          quantity: 1,
        });
      }
    });

    return items;
  };

  const handleQuantityChange = (id: string, delta: number) => {
    console.log(`Quantity change for ${id}: ${delta}`);
  };

  const resetSelection = () => {
    setSelectedPlatform(null);
    setSelectedModules(new Set());
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
                console.log("Switched to domestic");
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
                console.log("Switched to public");
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
            console.log("Switched to playground");
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
            console.log("Switched to house");
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
              <CardTitle>Paso 1: Selecciona la Plataforma Base</CardTitle>
              <CardDescription>
                Elige la altura de la plataforma para tu {productType === "playground" ? "parque" : "casa"}
                {useType === "public" && " (versión reforzada para uso público)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {MOCK_PLATFORMS.map((platform) => {
                  const price = useType === "domestic" ? platform.priceDomestic : platform.pricePublic;
                  return (
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
                        ${price.toLocaleString()}
                      </div>
                      {useType === "public" && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Reforzada
                        </Badge>
                      )}
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
                      {MOCK_MODULES.techos.map((module) => {
                        const material = useType === "domestic" ? module.materialDomestic : module.materialPublic;
                        const price = useType === "domestic" ? module.priceDomestic : module.pricePublic;
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
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="resbalines" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {MOCK_MODULES.resbalines.map((module) => {
                        const material = useType === "domestic" ? module.materialDomestic : module.materialPublic;
                        const price = useType === "domestic" ? module.priceDomestic : module.pricePublic;
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
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="accesorios" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {MOCK_MODULES.accesorios.map((module) => {
                        const material = useType === "domestic" ? module.materialDomestic : module.materialPublic;
                        const price = useType === "domestic" ? module.priceDomestic : module.pricePublic;
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
            onGeneratePDF={() => console.log("Generate PDF")}
            onSave={() => console.log("Save quote")}
          />
        </div>
      </div>
    </div>
  );
}
