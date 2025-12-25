import { Briefcase, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Briefcase className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Job Description</h3>
          <p className="text-sm text-muted-foreground">Enter the job requirements to match against</p>
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
        className="min-h-[280px] bg-background/50 border-border/50 focus:border-accent/50"
      />
      
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        <span>Include required skills, experience level, and qualifications</span>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
