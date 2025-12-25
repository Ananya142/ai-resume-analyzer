import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © 2024 ResumeAI. Intelligent resume screening powered by NLP.
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive" />
          <span>for HR professionals</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
