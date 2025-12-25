import { FileText, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-6 border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ResumeAI</h1>
            <p className="text-xs text-muted-foreground">Smart Resume Screening</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Powered by NLP</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
