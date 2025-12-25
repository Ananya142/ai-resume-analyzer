import { FileText, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ResumeInput = ({ value, onChange }: ResumeInputProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Resume Content</h3>
          <p className="text-sm text-muted-foreground">Paste the candidate's resume text</p>
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
        className="min-h-[280px] bg-background/50 border-border/50 focus:border-primary/50"
      />
      
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <Upload className="w-3 h-3" />
        <span>Tip: Include work experience, skills, and education for best results</span>
      </div>
    </div>
  );
};

export default ResumeInput;
