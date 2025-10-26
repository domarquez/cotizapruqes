import { useState } from "react";
import InlineEditInput from "../InlineEditInput";

export default function InlineEditInputExample() {
  const [value, setValue] = useState("280000");

  return (
    <div className="p-8 space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Hover para editar:</p>
        <InlineEditInput
          value={value}
          onSave={(newValue) => {
            console.log("New value:", newValue);
            setValue(newValue);
          }}
          type="number"
          testId="example-price"
        />
      </div>
    </div>
  );
}
