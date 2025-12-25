import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ResumeScreener from "@/components/ResumeScreener";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ResumeScreener />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
