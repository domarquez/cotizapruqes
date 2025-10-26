import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Download, Save } from "lucide-react";

interface SummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PriceSummaryProps {
  items: SummaryItem[];
  onQuantityChange: (id: string, delta: number) => void;
  onGeneratePDF: () => void;
  onSave: () => void;
}

export default function PriceSummary({
  items,
  onQuantityChange,
  onGeneratePDF,
  onSave,
}: PriceSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="sticky top-20" data-testid="card-price-summary">
      <CardHeader>
        <CardTitle>Resumen de Cotización</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8" data-testid="text-empty-summary">
            Agrega módulos para ver tu cotización
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="space-y-2" data-testid={`summary-item-${item.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 text-sm" data-testid={`text-item-name-${item.id}`}>
                    {item.name}
                  </div>
                  <div className="text-sm font-semibold" data-testid={`text-item-price-${item.id}`}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 hover-elevate active-elevate-2"
                    onClick={() => onQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    data-testid={`button-decrease-${item.id}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 hover-elevate active-elevate-2"
                    onClick={() => onQuantityChange(item.id, 1)}
                    data-testid={`button-increase-${item.id}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-2xl font-bold text-primary" data-testid="text-total-price">
                ${total.toLocaleString()}
              </div>
            </div>
          </>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full hover-elevate active-elevate-2"
            onClick={onGeneratePDF}
            data-testid="button-generate-pdf"
          >
            <Download className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
          <Button
            variant="outline"
            className="w-full hover-elevate active-elevate-2"
            onClick={onSave}
            data-testid="button-save-quote"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Cotización
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
