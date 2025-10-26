import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Download, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QuoteClientDialog from "./QuoteClientDialog";
import jsPDF from "jspdf";

interface SummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PriceSummaryProps {
  items: SummaryItem[];
  onQuantityChange: (id: string, delta: number) => void;
  useType?: "domestic" | "public";
  productType?: "playground" | "house";
}

export default function PriceSummary({
  items,
  onQuantityChange,
  useType = "domestic",
  productType = "playground",
}: PriceSummaryProps) {
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [actionType, setActionType] = useState<"save" | "pdf">("save");
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveQuoteMutation = useMutation({
    mutationFn: async (clientData: { name: string; email: string; phone?: string }) => {
      const quoteData = {
        clientName: clientData.name,
        clientEmail: clientData.email,
        clientPhone: clientData.phone || null,
        productType,
        useType,
        configuration: JSON.stringify(items),
        totalPrice: total.toString(),
      };
      
      return await apiRequest("POST", "/api/quotes", quoteData);
    },
    onSuccess: () => {
      toast({ title: "Cotización guardada exitosamente" });
      setShowClientDialog(false);
    },
    onError: () => {
      toast({ title: "Error al guardar cotización", variant: "destructive" });
    },
  });

  const generatePDF = (clientData: { name: string; email: string; phone?: string }) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("Cotización - Mobiliario Urbano", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Cliente: ${clientData.name}`, 20, 35);
    doc.text(`Email: ${clientData.email}`, 20, 42);
    if (clientData.phone) {
      doc.text(`Teléfono: ${clientData.phone}`, 20, 49);
    }
    
    doc.text(`Tipo de Uso: ${useType === "domestic" ? "Domicilio" : "Público"}`, 20, clientData.phone ? 56 : 49);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, clientData.phone ? 63 : 56);
    
    // Items table header
    const startY = clientData.phone ? 75 : 68;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Cantidad", 20, startY);
    doc.text("Descripción", 50, startY);
    doc.text("Precio Unit.", 130, startY);
    doc.text("Subtotal", 170, startY);
    
    // Items
    doc.setFont("helvetica", "normal");
    let currentY = startY + 8;
    items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      doc.text(item.quantity.toString(), 25, currentY);
      doc.text(item.name, 50, currentY);
      doc.text(`Bs ${item.price.toLocaleString()}`, 130, currentY);
      doc.text(`Bs ${subtotal.toLocaleString()}`, 170, currentY);
      currentY += 7;
    });
    
    // Total
    currentY += 5;
    doc.line(20, currentY, 190, currentY);
    currentY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total:", 130, currentY);
    doc.text(`Bs ${total.toLocaleString()}`, 170, currentY);
    
    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Esta cotización tiene validez de 30 días", 20, 280);
    doc.text("Mobiliario Urbano - Parques y Casas de Madera", 20, 285);
    
    // Save
    doc.save(`cotizacion-${clientData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`);
    
    toast({ title: "PDF generado exitosamente" });
    setShowClientDialog(false);
  };

  const handleClientSubmit = (clientData: { name: string; email: string; phone?: string }) => {
    if (actionType === "save") {
      saveQuoteMutation.mutate(clientData);
    } else {
      generatePDF(clientData);
    }
  };

  const handleSaveClick = () => {
    setActionType("save");
    setShowClientDialog(true);
  };

  const handlePDFClick = () => {
    setActionType("pdf");
    setShowClientDialog(true);
  };

  return (
    <>
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
                      Bs {(item.price * item.quantity).toLocaleString()}
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
                  Bs {total.toLocaleString()}
                </div>
              </div>
            </>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full hover-elevate active-elevate-2"
              onClick={handlePDFClick}
              data-testid="button-generate-pdf"
            >
              <Download className="mr-2 h-4 w-4" />
              Generar PDF
            </Button>
            <Button
              variant="outline"
              className="w-full hover-elevate active-elevate-2"
              onClick={handleSaveClick}
              data-testid="button-save-quote"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Cotización
            </Button>
          </CardFooter>
        )}
      </Card>

      <QuoteClientDialog
        open={showClientDialog}
        onClose={() => setShowClientDialog(false)}
        onSubmit={handleClientSubmit}
        isLoading={saveQuoteMutation.isPending}
      />
    </>
  );
}
