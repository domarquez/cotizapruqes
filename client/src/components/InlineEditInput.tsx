import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineEditInputProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: "text" | "number";
  className?: string;
  testId?: string;
}

export default function InlineEditInput({
  value,
  onSave,
  type = "text",
  className,
  testId,
}: InlineEditInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
    console.log(`Saved: ${editValue}`);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div 
        className={cn("flex items-center gap-2 group", className)}
        data-testid={testId}
      >
        <span>{value}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover-elevate"
          onClick={() => setIsEditing(true)}
          data-testid={`${testId}-edit-button`}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="h-8"
        autoFocus
        data-testid={`${testId}-input`}
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover-elevate"
        onClick={handleSave}
        data-testid={`${testId}-save-button`}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover-elevate"
        onClick={handleCancel}
        data-testid={`${testId}-cancel-button`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
