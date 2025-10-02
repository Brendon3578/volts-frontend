"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type GroupImageUploadProps = {
  className?: string;
  onImageChange?: (file: File | null, preview: string | null) => void;
  maxSize?: number;
  disabled?: boolean;
  labelText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function GroupImageUpload({
  className,
  onImageChange,
  maxSize = 5,
  disabled = false,
  labelText = "Upload de Imagem",
  ...inputProps
}: GroupImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = (file: File) => {
    setError(null);

    // Validações
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Apenas arquivos de imagem são aceitos");
      return;
    }

    // Gerar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setFile(file);
      onImageChange?.(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setError(null);
    onImageChange?.(null, null);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <Label className="text-sm font-medium">{labelText}</Label>

      {!preview ? (
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() =>
            !disabled && document.getElementById("file-input")?.click()
          }
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={cn(
                  "p-4 rounded-full transition-colors",
                  isDragging ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Upload className="h-8 w-8" />
              </div>

              <div className="text-center space-y-2">
                <p className="font-medium">
                  {isDragging
                    ? "Solte a imagem aqui"
                    : "Clique ou arraste uma imagem"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, JPEG até {maxSize}MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />

              {/* Overlay com botões */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    disabled={disabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Trocar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>

            {/* Info do arquivo */}
            {file && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{file.type}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Input oculto */}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
        {...inputProps}
      />

      {/* Erro */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
          {error}
        </p>
      )}
    </div>
  );
}
