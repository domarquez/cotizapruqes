import { useState } from "react";
import QuoteClientDialog from "../QuoteClientDialog";
import { Button } from "@/components/ui/button";

export default function QuoteClientDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Abrir Dialog</Button>
      <QuoteClientDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          console.log("Client data:", data);
          setOpen(false);
        }}
      />
    </div>
  );
}
