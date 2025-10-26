import { useState } from "react";
import ImageUpload from "../ImageUpload";

export default function ImageUploadExample() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-8 max-w-md">
      <ImageUpload
        onImageChange={(newFile) => {
          console.log("Image changed:", newFile);
          setFile(newFile);
        }}
        label="Imagen del Producto"
        testId="example-upload"
      />
      {file && (
        <p className="mt-4 text-sm text-muted-foreground">
          Archivo seleccionado: {file.name}
        </p>
      )}
    </div>
  );
}
