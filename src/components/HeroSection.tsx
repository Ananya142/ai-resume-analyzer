import { Sparkles, Zap, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174_72%_46%/0.15),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">AI-Powered Resume Analysis</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Screen Resumes with
          <span className="gradient-text block mt-2">Intelligent Precision</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Leverage advanced NLP to instantly analyze resumes, extract key skills, and match candidates to your job requirements with unparalleled accuracy.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Instant Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Skill Matching</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Smart Scoring</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
