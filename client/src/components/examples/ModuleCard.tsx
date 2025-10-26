import { useState } from "react";
import ModuleCard from "../ModuleCard";

export default function ModuleCardExample() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <div className="max-w-xs">
        <h3 className="text-sm font-medium mb-2">Uso Doméstico</h3>
        <ModuleCard
          id="1"
          name="Resbalín Plástico"
          material="Plástico HD"
          price={85000}
          isSelected={selected}
          onToggle={() => {
            console.log("Module toggled");
            setSelected(!selected);
          }}
          useType="domestic"
        />
      </div>
      
      <div className="max-w-xs">
        <h3 className="text-sm font-medium mb-2">Uso Público (Reforzado)</h3>
        <ModuleCard
          id="2"
          name="Resbalín Plástico"
          material="Plástico industrial reforzado"
          price={145000}
          isSelected={false}
          onToggle={() => console.log("Module toggled")}
          useType="public"
        />
      </div>
    </div>
  );
}
