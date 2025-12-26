import { Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <FileUpload
        onTextExtracted={onChange}
        label="Job Description"
        description="Upload the job requirements"
        icon={<Briefcase className="w-5 h-5 text-accent" />}
        accentColor="accent"
      />
    </div>
  );
};

export default JobDescriptionInput;
