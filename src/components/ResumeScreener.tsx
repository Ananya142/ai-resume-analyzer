import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText: resume,
          jobDescription: jobDescription,
        },
      });

      if (error) {
        throw error;
      }

      if (!data.success || !data.analysis) {
        throw new Error(data.error || "Analysis failed");
      }

      const analysis = data.analysis;

      // Ensure the recommendation is one of the valid values
      const validRecommendation = ["strong", "moderate", "weak"].includes(analysis.recommendation)
        ? analysis.recommendation
        : analysis.overallScore >= 75 ? "strong" : analysis.overallScore >= 50 ? "moderate" : "weak";

      setResults({
        overallScore: Math.round(analysis.overallScore),
        matchedSkills: analysis.matchedSkills || [],
        missingSkills: analysis.missingSkills || [],
        experienceMatch: analysis.experienceMatch || "Experience evaluation not available",
        educationMatch: analysis.educationMatch || "Education evaluation not available",
        summary: analysis.summary || "Analysis complete",
        recommendation: validRecommendation,
      });

      toast({
        title: "Analysis Complete",
        description: `Resume scored ${Math.round(analysis.overallScore)}% match with the job requirements.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Analysis Failed",
        description: errorMessage,
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
