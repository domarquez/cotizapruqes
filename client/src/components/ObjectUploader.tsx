// Image uploader component for local file storage
// Uploads images to server's public/uploads directory
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onComplete?: (result: { successful: Array<{ uploadURL: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A simplified file upload component for local storage
 * Uploads images to the server's public/uploads directory
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: "Archivo demasiado grande",
        description: `El archivo debe ser menor a ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Solo se permiten imágenes",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create form data with the image
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload file to local server
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Call completion handler
      onComplete?.({
        successful: [{
          uploadURL: data.imageUrl,
        }],
      });

      toast({
        title: "Imagen subida exitosamente",
      });

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error al subir imagen",
        description: "Inténtalo de nuevo",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={buttonClassName}
        data-testid="button-upload-image"
      >
        {children}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
