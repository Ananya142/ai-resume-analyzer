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
        description="Upload or paste the candidate's resume"
        icon={<FileText className="w-5 h-5 text-primary" />}
        accentColor="primary"
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
        placeholder="Paste resume content here...

Example:
John Doe
Senior Software Engineer

Experience:
- 5 years of experience in full-stack development
- Expertise in React, Node.js, Python, and AWS
- Led a team of 5 developers on enterprise projects

Education:
- B.S. Computer Science, MIT

Skills:
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary/50"
      />
    </div>
  );
};

export default ResumeInput;
