import { Textarea } from "@/components/ui/textarea";

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
  label,
  description,
  icon,
  accentColor = "primary"
}: FileUploadProps) => {
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

      <Textarea
        onChange={(e) => onTextExtracted(e.target.value)}
        placeholder={`Paste your ${label.toLowerCase()} text here...`}
        className="min-h-[180px]"
      />
    </div>
  );
};

export default FileUpload;
