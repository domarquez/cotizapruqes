import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  id: string;
  name: string;
  material: string;
  price: number;
  isSelected: boolean;
  onToggle: () => void;
  useType?: "domestic" | "public";
}

export default function ModuleCard({
  id,
  name,
  material,
  price,
  isSelected,
  onToggle,
  useType = "domestic",
}: ModuleCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover-elevate active-elevate-2 transition-all relative",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onToggle}
      data-testid={`card-module-${id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold mb-1" data-testid={`text-module-name-${id}`}>
              {name}
            </h4>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-material-${id}`}>
              {material}
            </Badge>
            {useType === "public" && (
              <Badge variant="default" className="text-xs ml-2">
                Reforzado
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "rounded-full p-1 transition-colors",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
            data-testid={`icon-select-${id}`}
          >
            {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </div>
        <div className="text-lg font-bold text-primary" data-testid={`text-module-price-${id}`}>
          +Bs {price.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
