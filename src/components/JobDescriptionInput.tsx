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
        description="Upload or paste the job requirements"
        icon={<Briefcase className="w-5 h-5 text-accent" />}
        accentColor="accent"
      />
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-muted-foreground">or paste text</span>
        </div>
      </div>
      
      <Textarea
        placeholder="Enter job description here...

Example:
Senior Full-Stack Developer

We are looking for an experienced developer with:
- 4+ years of experience in web development
- Strong proficiency in React and Node.js
- Experience with cloud services (AWS preferred)
- Knowledge of SQL databases
- Team leadership experience is a plus

Requirements:
- Bachelor's degree in Computer Science or related field
- Excellent problem-solving skills
- Strong communication abilities"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] bg-background/50 border-border/50 focus:border-accent/50"
      />
    </div>
  );
};

export default JobDescriptionInput;
