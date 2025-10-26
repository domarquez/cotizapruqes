import { useState } from "react";
import PriceSummary from "../PriceSummary";

export default function PriceSummaryExample() {
  const [items, setItems] = useState([
    { id: "1", name: "Plataforma 1.20m", price: 350000, quantity: 1 },
    { id: "2", name: "Resbalín Plástico", price: 85000, quantity: 1 },
    { id: "3", name: "Techo Madera", price: 120000, quantity: 2 },
  ]);

  const handleQuantityChange = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  return (
    <div className="p-8 max-w-md">
      <PriceSummary
        items={items}
        onQuantityChange={handleQuantityChange}
        useType="domestic"
      />
    </div>
  );
}
