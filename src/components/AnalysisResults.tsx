import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultsProps {
  results: {
    overallScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    experienceMatch: string;
    educationMatch: string;
    summary: string;
    recommendation: "strong" | "moderate" | "weak";
  } | null;
  isLoading: boolean;
}

const AnalysisResults = ({ results, isLoading }: AnalysisResultsProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Analyzing Resume</p>
          <p className="text-sm text-muted-foreground">Extracting skills and matching against requirements...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="glass-card p-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Ready to Analyze</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter a resume and job description, then click "Analyze Match" to see detailed results
          </p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getRecommendationStyles = (rec: string) => {
    switch (rec) {
      case "strong":
        return { bg: "bg-success/10", text: "text-success", border: "border-success/30" };
      case "moderate":
        return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" };
      default:
        return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" };
    }
  };

  const recStyles = getRecommendationStyles(results.recommendation);

  return (
    <div className="glass-card p-6 animate-scale-in">
      {/* Score Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Analysis Results</h3>
          <p className="text-sm text-muted-foreground">AI-powered resume evaluation</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
            {results.overallScore}%
          </div>
          <p className="text-xs text-muted-foreground">Match Score</p>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress-fill"
            style={{ "--progress-width": `${results.overallScore}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Recommendation Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${recStyles.bg} ${recStyles.border} border mb-6`}>
        <Award className={`w-4 h-4 ${recStyles.text}`} />
        <span className={`font-medium capitalize ${recStyles.text}`}>
          {results.recommendation} Match
        </span>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-foreground leading-relaxed">{results.summary}</p>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Matched Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="font-medium text-foreground">Matched Skills</span>
            <span className="text-xs text-muted-foreground">({results.matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.matchedSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-success/10 text-success border-success/30 hover:bg-success/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="font-medium text-foreground">Missing Skills</span>
            <span className="text-xs text-muted-foreground">({results.missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.missingSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Matches */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Experience</span>
          </div>
          <p className="text-sm text-muted-foreground">{results.experienceMatch}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Education</span>
          </div>
          <p className="text-sm text-muted-foreground">{results.educationMatch}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
