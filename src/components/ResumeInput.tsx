import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ResumeInput = ({ value, onChange }: ResumeInputProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <FileUpload
        onTextExtracted={onChange}
        label="Resume"
        description="Upload the candidate's resume"
        icon={<FileText className="w-5 h-5 text-primary" />}
        accentColor="primary"
      />
    </div>
  );
};

export default ResumeInput;
