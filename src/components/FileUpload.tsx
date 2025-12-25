import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  accept?: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: string;
}

const FileUpload = ({ 
  onTextExtracted, 
  accept = ".pdf,.doc,.docx,.txt",
  label,
  description,
  icon,
  accentColor = "primary"
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setFileName(file.name);

    try {
      // For text files, read directly
      if (file.type === "text/plain") {
        const text = await file.text();
        onTextExtracted(text);
        setIsProcessing(false);
        return;
      }

      // For PDF and Word docs, we'll read as text for now
      // In a production app, you'd send to a document parsing service
      if (file.type === "application/pdf") {
        // PDF files need server-side processing
        // For now, we'll inform the user to paste the text
        setError("PDF parsing requires copying text manually. Please paste the resume content in the text area below.");
        setIsProcessing(false);
        return;
      }

      // For Word docs
      if (file.type.includes("word") || file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        setError("Word document parsing requires copying text manually. Please paste the content in the text area below.");
        setIsProcessing(false);
        return;
      }

      // Try to read as text for other file types
      const text = await file.text();
      onTextExtracted(text);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process file. Please paste the content manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-${accentColor}/10`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${isDragging 
            ? `border-${accentColor} bg-${accentColor}/5` 
            : "border-border/50 hover:border-border hover:bg-muted/30"
          }
          ${fileName ? "bg-muted/20" : ""}
        `}
        onClick={() => fileInputRef.current?.click()}
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
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing {fileName}...</p>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">File uploaded</p>
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
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="p-3 rounded-full bg-muted">
              <Upload className="w-6 h-6 text-muted-foreground" />
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

      {error && (
        <p className="text-xs text-warning bg-warning/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
