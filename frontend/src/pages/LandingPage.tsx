import FeatureGateways from "@/components/FeatureGateways";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <div className="container mx-auto px-4">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#139436] to-transparent" />
      </div>
      <FeatureGateways />
    </>
  );
};

export default LandingPage;