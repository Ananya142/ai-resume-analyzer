import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ResumeInput from "./ResumeInput";
import JobDescriptionInput from "./JobDescriptionInput";
import AnalysisResults from "./AnalysisResults";

interface AnalysisResult {
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  educationMatch: string;
  summary: string;
  recommendation: "strong" | "moderate" | "weak";
}

const ResumeScreener = () => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both a resume and job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      // Simulated AI analysis - in production, this would call an edge function
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Extract skills from resume (simple keyword extraction simulation)
      const resumeLower = resume.toLowerCase();
      const jobLower = jobDescription.toLowerCase();

      const allSkills = [
        "javascript", "typescript", "react", "node.js", "python", "aws", "docker",
        "postgresql", "mongodb", "git", "agile", "leadership", "communication",
        "java", "c++", "sql", "nosql", "kubernetes", "ci/cd", "rest api",
        "graphql", "html", "css", "vue", "angular", "express", "django", "flask"
      ];

      const resumeSkills = allSkills.filter(skill => 
        resumeLower.includes(skill.toLowerCase())
      );

      const requiredSkills = allSkills.filter(skill => 
        jobLower.includes(skill.toLowerCase())
      );

      const matchedSkills = resumeSkills.filter(skill => 
        requiredSkills.includes(skill)
      );

      const missingSkills = requiredSkills.filter(skill => 
        !resumeSkills.includes(skill)
      );

      // Calculate score
      const skillScore = requiredSkills.length > 0 
        ? (matchedSkills.length / requiredSkills.length) * 100 
        : 50;

      // Check for experience mentions
      const hasExperience = /\d+\s*(years?|yrs?)/i.test(resume);
      const experienceBonus = hasExperience ? 10 : 0;

      // Check for education
      const hasEducation = /(bachelor|master|phd|degree|university|college)/i.test(resume);
      const educationBonus = hasEducation ? 5 : 0;

      const overallScore = Math.min(100, Math.round(skillScore * 0.7 + experienceBonus + educationBonus + Math.random() * 10));

      const recommendation: "strong" | "moderate" | "weak" = 
        overallScore >= 75 ? "strong" : 
        overallScore >= 50 ? "moderate" : "weak";

      const experienceMatch = hasExperience 
        ? "Candidate shows relevant work experience" 
        : "Experience details could be more detailed";

      const educationMatch = hasEducation 
        ? "Educational background aligns with requirements" 
        : "Educational qualifications not clearly specified";

      const summaryParts = [
        `The candidate demonstrates ${matchedSkills.length} out of ${requiredSkills.length} required skills.`,
        matchedSkills.length > 0 ? `Strong matches in ${matchedSkills.slice(0, 3).join(", ")}.` : "",
        missingSkills.length > 0 ? `Consider evaluating proficiency in ${missingSkills.slice(0, 2).join(" and ")}.` : "Excellent skill coverage.",
      ].filter(Boolean);

      setResults({
        overallScore,
        matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        experienceMatch,
        educationMatch,
        summary: summaryParts.join(" "),
        recommendation,
      });

      toast({
        title: "Analysis Complete",
        description: `Resume scored ${overallScore}% match with the job requirements.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Input Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ResumeInput value={resume} onChange={setResume} />
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center mb-10">
          <Button
            variant="hero"
            size="xl"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Match
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        <AnalysisResults results={results} isLoading={isLoading} />
      </div>
    </section>
  );
};

export default ResumeScreener;
