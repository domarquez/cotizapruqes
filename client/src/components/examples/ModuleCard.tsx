import { useState } from "react";
import ModuleCard from "../ModuleCard";

export default function ModuleCardExample() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="p-8 max-w-xs">
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
      />
    </div>
  );
}
