// Referenced from blueprint: javascript_object_storage
// Simplified version without Uppy Dashboard UI to avoid CSS import issues
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A simplified file upload component for object storage
 * Uses native file input instead of Uppy Dashboard to avoid CSS dependency issues
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
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
      // Get upload URL from backend
      const uploadParams = await onGetUploadParameters();
      
      // Upload file to object storage
      const response = await fetch(uploadParams.url, {
        method: uploadParams.method,
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Call completion handler
      onComplete?.({
        successful: [{
          uploadURL: uploadParams.url.split('?')[0], // Remove query params
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
