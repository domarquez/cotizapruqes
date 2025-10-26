import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  label?: string;
  testId?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = "Imagen del Producto",
  testId,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
      console.log("Image uploaded:", file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.log("Image removed");
  };

  return (
    <div className="space-y-2" data-testid={testId}>
      <label className="text-sm font-medium">{label}</label>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging && "border-primary bg-primary/5"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
                data-testid={`${testId}-preview`}
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover-elevate active-elevate-2"
                onClick={handleRemove}
                data-testid={`${testId}-remove`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="hover-elevate active-elevate-2"
                data-testid={`${testId}-upload-button`}
              >
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Imagen
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            data-testid={`${testId}-input`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
