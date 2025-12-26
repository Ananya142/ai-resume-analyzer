import { useState, useRef } from "react";
import { Upload, X, Loader2, CheckCircle2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  accept?: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: string;
}

type InputMode = "upload" | "paste";

const FileUpload = ({ 
  onTextExtracted, 
  accept = ".pdf,.doc,.docx,.txt",
  label,
  description,
  icon,
  accentColor = "primary"
}: FileUploadProps) => {
  const [mode, setMode] = useState<InputMode>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setIsSuccess(false);
    setFileName(file.name);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit");
      }

      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        onTextExtracted(text);
        setIsSuccess(true);
        setIsProcessing(false);
        return;
      }

      const base64 = await fileToBase64(file);
      
      const { data, error: parseError } = await supabase.functions.invoke("parse-document", {
        body: {
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type,
        },
      });

      if (parseError) {
        throw parseError;
      }

      if (!data.success || !data.text) {
        throw new Error(data.error || "Failed to extract text from document");
      }

      onTextExtracted(data.text);
      setIsSuccess(true);
    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : "Failed to process file");
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const clearFile = () => {
    setFileName(null);
    setError(null);
    setIsSuccess(false);
    onTextExtracted("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasteChange = (text: string) => {
    setPastedText(text);
    onTextExtracted(text);
  };

  const switchMode = (newMode: InputMode) => {
    setMode(newMode);
    clearFile();
    setPastedText("");
    onTextExtracted("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${accentColor}/10`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          <Button
            variant={mode === "upload" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => switchMode("upload")}
            className="h-7 px-3 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
          <Button
            variant={mode === "paste" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => switchMode("paste")}
            className="h-7 px-3 text-xs"
          >
            <Type className="w-3 h-3 mr-1" />
            Paste
          </Button>
        </div>
      </div>

      {mode === "paste" ? (
        <Textarea
          value={pastedText}
          onChange={(e) => handlePasteChange(e.target.value)}
          placeholder={`Paste your ${label.toLowerCase()} text here...`}
          className="min-h-[180px]"
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer
            ${isDragging 
              ? `border-${accentColor} bg-${accentColor}/5` 
              : "border-border/50 hover:border-border hover:bg-muted/30"
            }
            ${isSuccess ? "border-success/50 bg-success/5" : ""}
          `}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Processing {fileName}...</p>
                <p className="text-xs text-muted-foreground mt-1">Extracting text content</p>
              </div>
            </div>
          ) : isSuccess && fileName ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{fileName}</p>
                  <p className="text-xs text-success">Document processed successfully</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 rounded-full bg-muted">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Drop file here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PDF, DOC, DOCX, TXT (max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
